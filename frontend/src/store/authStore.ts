import { create } from 'zustand';
import { authApi } from '../api/auth';
import type { User } from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: URLSearchParams) => Promise<void>;
  register: (userData: Record<string, string>) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUser: (profileData: Record<string, any>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { access_token } = await authApi.login(credentials);
      localStorage.setItem('access_token', access_token);
      set({ token: access_token, isAuthenticated: true });
      await get().fetchUser();
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Ошибка авторизации' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.register(userData);
      // После успешной регистрации пытаемся сразу войти
      const params = new URLSearchParams();
      params.append('username', userData.email);
      params.append('password', userData.password);
      await get().login(params);
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Ошибка регистрации' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authApi.getMe();
      set({ user });
    } catch (error: any) {
      if (error.response?.status === 401) {
        get().logout();
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.updateMe(profileData);
      await get().fetchUser();
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Ошибка обновления профиля' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

// Слушаем событие от интерцептора
window.addEventListener('unauthorized', () => {
  useAuthStore.getState().logout();
});
