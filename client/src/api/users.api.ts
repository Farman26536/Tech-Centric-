import axios from 'axios';
import type { User, UserInput, UserListResponse } from '../types/user.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const usersApi = {
  list: async (page = 1, limit = 20, search = '', role = '') => {
    const { data } = await api.get<{ success: boolean; data: UserListResponse }>('/users', {
      params: { page, limit, search, role }
    });
    return data.data;
  },

  get: async (id: string) => {
    const { data } = await api.get<{ success: boolean; data: User }>(`/users/${id}`);
    return data.data;
  },

  getCurrent: async () => {
    const { data } = await api.get<{ success: boolean; data: User }>('/users/me');
    return data.data;
  },

  update: async (id: string, input: UserInput) => {
    const { data } = await api.put<{ success: boolean; data: User }>(`/users/${id}`, input);
    return data.data;
  },

  updateRole: async (id: string, role: 'ADMIN' | 'MEMBER') => {
    const { data } = await api.put<{ success: boolean; data: User }>(`/users/${id}/role`, { role });
    return data.data;
  }
};
