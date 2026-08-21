import axios from 'axios';
import type { Project, ProjectInput, ProjectListResponse } from '../types/project.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const projectsApi = {
  list: async (page = 1, limit = 20, search = '', status = '') => {
    const { data } = await api.get<{ success: boolean; data: ProjectListResponse }>('/projects', {
      params: { page, limit, search, status }
    });
    return data.data;
  },

  get: async (id: string) => {
    const { data } = await api.get<{ success: boolean; data: Project }>(`/projects/${id}`);
    return data.data;
  },

  create: async (input: ProjectInput) => {
    const { data } = await api.post<{ success: boolean; data: Project }>('/projects', input);
    return data.data;
  },

  update: async (id: string, input: Partial<ProjectInput>) => {
    const { data } = await api.put<{ success: boolean; data: Project }>(`/projects/${id}`, input);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<{ success: boolean; data: null }>(`/projects/${id}`);
    return data;
  }
};
