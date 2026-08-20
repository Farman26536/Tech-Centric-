import api from './http';
import type { PaginatedTasks, Task, TaskFiltersParams, TaskInput, TaskStatusInput } from '../types/teamflow';

const unwrap = <T,>(payload: { data: T } | T): T =>
  (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload) as T;

export async function getTasks(params: TaskFiltersParams = {}): Promise<PaginatedTasks> {
  const { data } = await api.get<{ data: Task[]; pagination: PaginatedTasks['pagination'] }>('/tasks', { params });
  return {
    data: data.data,
    pagination: data.pagination,
  };
}

export async function getTask(id: string): Promise<Task> {
  const { data } = await api.get<{ data: Task }>(`/tasks/${id}`);
  return unwrap(data);
}

export async function createTask(input: TaskInput): Promise<Task> {
  const { data } = await api.post<{ data: Task }>('/tasks', input);
  return unwrap(data);
}

export async function updateTask(id: string, input: TaskInput): Promise<Task> {
  const { data } = await api.put<{ data: Task }>(`/tasks/${id}`, input);
  return unwrap(data);
}

export async function updateTaskStatus(id: string, input: TaskStatusInput): Promise<Task> {
  const { data } = await api.patch<{ data: Task }>(`/tasks/${id}/status`, input);
  return unwrap(data);
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
