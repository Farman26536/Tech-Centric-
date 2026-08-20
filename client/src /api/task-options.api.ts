import api from './http';
import type { ProjectSummary, UserSummary } from '../types/teamflow';

const unwrap = <T,>(payload: { data: T } | T): T =>
  (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload) as T;

export async function getTaskProjects(): Promise<ProjectSummary[]> {
  const { data } = await api.get<{ data: ProjectSummary[] }>('/projects');
  return unwrap(data);
}

export async function getTaskMembers(): Promise<UserSummary[]> {
  const { data } = await api.get<{ data: UserSummary[] }>('/users');
  return unwrap(data);
}
