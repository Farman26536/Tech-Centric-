import { api } from './axios';
import type { AuthResponse, User } from '../types/auth';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MEMBER';
}

export const register = async (input: RegisterInput): Promise<User> => {
  const response = await api.post<AuthResponse>('/auth/register', input);
  return response.data.data.user;
};

export const login = async (input: LoginInput): Promise<User> => {
  const response = await api.post<AuthResponse>('/auth/login', input);
  return response.data.data.user;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<AuthResponse>('/auth/me');
  return response.data.data.user;
};
