import { api } from './axios';
import type { User } from '../types';

export const fetchUsers = async (page = 1, limit = 20) => {
  const res = await api.get('/users', { params: { page, limit } });
  return res.data.data as { data: User[]; meta: any };
};

export const fetchUser = async (id: string) => {
  const res = await api.get(`/users/${id}`);
  return res.data.data.user as User;
};

export const updateUser = async (id: string, payload: Partial<User>) => {
  const res = await api.put(`/users/${id}`, payload);
  return res.data.data.user as User;
};

export const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
};
