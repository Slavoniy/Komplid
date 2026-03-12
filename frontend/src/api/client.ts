import axios from 'axios';

// Используем proxy, настроенный в Vite (или относительные пути, если один домен)
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Hardcoded for local verification
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Очистка стора будет происходить в самом сторе
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
