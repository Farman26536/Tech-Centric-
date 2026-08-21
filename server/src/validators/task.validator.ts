import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
  dueDate: z.string().optional().nullable(),
  projectId: z.string().uuid(),
  assignedToId: z.string().uuid().optional().nullable()
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateTaskStatusSchema = z.object({ status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']) });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
