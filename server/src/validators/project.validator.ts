import { z } from 'zod';

const projectDateValue = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return null;
  return value;
}, z.union([
  z.date(),
  z.string().trim().refine((val) => val.length > 0 && !Number.isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }).transform((val) => new Date(val)),
  z.null()
]));

export const createProjectSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  startDate: projectDateValue.optional(),
  dueDate: projectDateValue.optional()
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
