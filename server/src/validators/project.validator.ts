import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable()
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
