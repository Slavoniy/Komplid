import api from './client';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string | null;
  company: {
    id: number | null;
    name: string | null;
  };
  profile: {
    phone: string | null;
    position: string | null;
    city: string | null;
    nrs_number: string | null;
    avatar_url: string | null;
  };
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  login: async (credentials: URLSearchParams): Promise<AuthResponse> => {
    // URLSearchParams используется для совместимости с OAuth2PasswordRequestForm
    const { data } = await api.post<AuthResponse>('/auth/token', credentials, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return data;
  },

  register: async (userData: Record<string, string>): Promise<{msg: string, user_id: number}> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  updateMe: async (profileData: Record<string, any>): Promise<{msg: string}> => {
    const { data } = await api.put('/users/me', profileData);
    return data;
  }
};
