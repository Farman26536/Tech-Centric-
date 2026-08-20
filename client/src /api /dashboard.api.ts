import api from './http';
import type { DashboardData, DashboardOverview, DashboardProjectProgress, DashboardCharts } from '../types/teamflow';

const unwrap = <T,>(payload: { data: T } | T): T =>
  (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload) as T;

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const { data } = await api.get<{ data: DashboardOverview }>('/dashboard/overview');
  return unwrap(data);
}

export async function getDashboardProjects(): Promise<DashboardProjectProgress[]> {
  const { data } = await api.get<{ data: DashboardProjectProgress[] }>('/dashboard/projects');
  return unwrap(data);
}

export async function getDashboardTasks(): Promise<DashboardCharts> {
  const { data } = await api.get<{ data: DashboardCharts }>('/dashboard/tasks');
  return unwrap(data);
}

export async function getDashboardData(): Promise<DashboardData> {
  const [overview, projects, charts] = await Promise.all([
    getDashboardOverview(),
    getDashboardProjects(),
    getDashboardTasks(),
  ]);

  return { ...overview, projects, charts };
}
