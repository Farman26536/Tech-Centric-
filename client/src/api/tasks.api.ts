import { api } from './axios';
import type { Task } from '../types/task';

export const fetchTasks = async (params = {}) => {
  const res = await api.get('/tasks', { params });
  return res.data.data as { data: Task[]; meta: any };
};

export const fetchTask = async (id: string) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data.data.task as Task & { comments?: any[] };
};

export const createTask = async (payload: Partial<Task>) => {
  const res = await api.post('/tasks', payload);
  return res.data.data.task as Task;
};

export const updateTask = async (id: string, payload: Partial<Task>) => {
  const res = await api.put(`/tasks/${id}`, payload);
  return res.data.data.task as Task;
};

export const updateTaskStatus = async (id: string, status: string) => {
  const res = await api.patch(`/tasks/${id}/status`, { status });
  return res.data.data.task as Task;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};
