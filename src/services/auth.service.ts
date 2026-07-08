import { api } from './';
import { AUTH_TOKEN_KEY } from '../constants';

export const AuthService = {
  async register(credentials: Record<'email' | 'password', string>) {
    const { data } = await api.post<{ access_token: string }>('/auth/register', credentials);
    if (data.access_token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    }
    return data;
  },

  async login(credentials: Record<'email' | 'password', string>) {
    const { data } = await api.post<{ access_token: string }>('/auth/login', credentials);
    if (data.access_token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.location.href = '/auth/login';
  },
};
