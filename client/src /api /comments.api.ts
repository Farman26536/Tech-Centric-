import api from './http';
import type { Comment, CommentInput } from '../types/teamflow';

const unwrap = <T,>(payload: { data: T } | T): T =>
  (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload) as T;

export async function getComments(taskId: string): Promise<Comment[]> {
  const { data } = await api.get<{ data: Comment[] }>(`/tasks/${taskId}/comments`);
  return unwrap(data);
}

export async function createComment(taskId: string, input: CommentInput): Promise<Comment> {
  const { data } = await api.post<{ data: Comment }>(`/tasks/${taskId}/comments`, input);
  return unwrap(data);
}

export async function updateComment(id: string, input: CommentInput): Promise<Comment> {
  const { data } = await api.put<{ data: Comment }>(`/comments/${id}`, input);
  return unwrap(data);
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(`/comments/${id}`);
}
