import { api } from './axios';

export const fetchComments = async (taskId: string) => {
  const res = await api.get(`/tasks/${taskId}/comments`);
  return res.data.data.comments as any[];
};

export const createComment = async (taskId: string, content: string) => {
  const res = await api.post(`/tasks/${taskId}/comments`, { content });
  return res.data.data.comment as any;
};

export const updateComment = async (id: string, content: string) => {
  const res = await api.put(`/comments/${id}`, { content });
  return res.data.data.comment as any;
};

export const deleteComment = async (id: string) => {
  await api.delete(`/comments/${id}`);
};
