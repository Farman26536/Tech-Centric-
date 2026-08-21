import { api } from './axios';
import type { Project } from '../types';

export const fetchProjects = async (page = 1, limit = 20) => {
  const res = await api.get('/projects', { params: { page, limit } });
  return res.data.data as { data: Project[]; meta: any };
};

export const fetchProject = async (id: string) => {
  const res = await api.get(`/projects/${id}`);
  return res.data.data.project as Project & { tasks?: any[] };
};

export const createProject = async (payload: Partial<Project>) => {
  const res = await api.post('/projects', payload);
  return res.data.data.project as Project;
};

export const updateProject = async (id: string, payload: Partial<Project>) => {
  const res = await api.put(`/projects/${id}`, payload);
  return res.data.data.project as Project;
};

export const archiveProject = async (id: string) => {
  const res = await api.patch(`/projects/${id}/archive`);
  return res.data.data.project as Project;
};

export const deleteProject = async (id: string) => {
  await api.delete(`/projects/${id}`);
};
