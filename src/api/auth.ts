import api from './axios';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{ message: string; user: User; token: string }>('/auth/login', credentials);
    return {
      token: response.data.token,
      user: response.data.user,
    };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<{ message: string; user: User; token: string }>('/auth/register', data);
    return {
      token: response.data.token,
      user: response.data.user,
    };
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  },
};

