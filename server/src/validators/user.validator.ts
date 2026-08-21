import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  role: z.enum(['ADMIN', 'MEMBER']).optional()
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
