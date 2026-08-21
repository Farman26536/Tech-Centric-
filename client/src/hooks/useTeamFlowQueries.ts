import type { Comment } from '../types/teamflow';

type QueryResult<T> = { data?: T; isLoading: boolean; isError: boolean };
type MutationResult = { mutateAsync: (arg?: any) => Promise<void>; isPending?: boolean };

export function useCommentsQuery(taskId: string): QueryResult<Comment[]> {
  return { data: [], isLoading: false, isError: false };
}

export function useCreateCommentMutation(taskId: string): MutationResult {
  return { mutateAsync: async () => {} };
}

export function useUpdateCommentMutation(taskId: string): MutationResult {
  return { mutateAsync: async () => {} };
}

export function useDeleteCommentMutation(taskId: string): MutationResult {
  return { mutateAsync: async () => {} };
}
