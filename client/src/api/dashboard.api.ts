import { api } from './axios';

export const fetchOverview = async () => {
  const res = await api.get('/dashboard/overview');
  return res.data.data as any;
};

export const fetchProjectsOverview = async () => {
  const res = await api.get('/dashboard/projects');
  return res.data.data as any;
};

export const fetchTasksOverview = async () => {
  const res = await api.get('/dashboard/tasks');
  return res.data.data as any;
};

export const fetchTeamPerformance = async () => {
  const res = await api.get('/dashboard/team-performance');
  return res.data.data as any;
};
