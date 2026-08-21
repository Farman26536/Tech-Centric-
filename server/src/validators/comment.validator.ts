import { z } from 'zod';

export const createCommentSchema = z.object({ content: z.string().trim().min(1) });
export const updateCommentSchema = createCommentSchema;

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
