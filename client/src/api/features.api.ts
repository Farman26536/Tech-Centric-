import { api } from './axios';

export const globalSearch = async (q: string) => {
  const res = await api.get('/features/search', { params: { q } });
  return res.data.data as { projects: any[]; tasks: any[] };
};

export const fetchAnalytics = async () => {
  const res = await api.get('/features/analytics');
  return res.data.data;
};

export const fetchActivities = async (params: { page?: number; limit?: number; taskId?: string; projectId?: string } = {}) => {
  const res = await api.get('/features/activities', { params });
  return res.data.data as { data: any[]; meta: any };
};

export const fetchNotifications = async () => {
  const res = await api.get('/features/notifications');
  return res.data.data.notifications as any[];
};

export const markNotificationRead = async (id: string) => {
  await api.patch(`/features/notifications/${id}/read`);
};

export const fetchAttachments = async (taskId: string) => {
  const res = await api.get(`/features/tasks/${taskId}/attachments`);
  return res.data.data.attachments as any[];
};

export const uploadAttachment = async (taskId: string, file: File) => {
  if (file.size > 5 * 1024 * 1024) throw new Error('Maximum attachment size is 5 MB.');
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const res = await api.post(`/features/tasks/${taskId}/attachments`, {
    fileName: file.name, mimeType: file.type || 'application/octet-stream', size: file.size, data
  });
  return res.data.data.attachment;
};

export const deleteAttachment = async (id: string) => {
  await api.delete(`/features/attachments/${id}`);
};

export const attachmentUrl = (id: string) => `${api.defaults.baseURL}/features/attachments/${id}/download`;
