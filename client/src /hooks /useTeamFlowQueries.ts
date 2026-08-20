import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboardData } from '../api/dashboard.api';
import { createComment, deleteComment, getComments, updateComment } from '../api/comments.api';
import { createTask, deleteTask, getTask, getTasks, updateTask, updateTaskStatus } from '../api/tasks.api';
import type { CommentInput, TaskFiltersParams, TaskInput, TaskStatus } from '../types/teamflow';

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  comments: (taskId: string) => ['tasks', taskId, 'comments'] as const,
};

export function useDashboardQuery() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: getDashboardData, staleTime: 30_000 });
}

export function useTasksQuery(filters: TaskFiltersParams) {
  return useQuery({ queryKey: [...queryKeys.tasks, filters], queryFn: () => getTasks(filters), staleTime: 10_000 });
}

export function useTaskQuery(id: string) {
  return useQuery({ queryKey: queryKeys.task(id), queryFn: () => getTask(id), enabled: Boolean(id) });
}

export function useCommentsQuery(taskId: string) {
  return useQuery({ queryKey: queryKeys.comments(taskId), queryFn: () => getComments(taskId), enabled: Boolean(taskId) });
}

export function useCreateTaskMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskInput) => createTask(input),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.tasks });
      void client.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateTaskMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskInput }) => updateTask(id, input),
    onSuccess: (task) => {
      client.setQueryData(queryKeys.task(task.id), task);
      void client.invalidateQueries({ queryKey: queryKeys.tasks });
      void client.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteTaskMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (_data, id) => {
      client.removeQueries({ queryKey: queryKeys.task(id) });
      void client.invalidateQueries({ queryKey: queryKeys.tasks });
      void client.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateTaskStatusMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => updateTaskStatus(id, { status }),
    onSuccess: (task) => {
      client.setQueryData(queryKeys.task(task.id), task);
      void client.invalidateQueries({ queryKey: queryKeys.tasks });
      void client.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useCreateCommentMutation(taskId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CommentInput) => createComment(taskId, input),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.comments(taskId) });
    },
  });
}

export function useUpdateCommentMutation(taskId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CommentInput }) => updateComment(id, input),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.comments(taskId) });
    },
  });
}

export function useDeleteCommentMutation(taskId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.comments(taskId) });
    },
  });
}
