import { z } from 'zod';

const parseDate = (value: string | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const projectBaseSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required'),
  description: z.string().trim().max(2000, 'Description is too long').optional().or(z.literal('')),
  startDate: z.string().trim().min(1, 'Start date is required'),
  dueDate: z.string().trim().min(1, 'End date is required').optional().nullable(),
  endDate: z.string().trim().min(1, 'End date is required').optional().nullable()
});

export const createProjectSchema = projectBaseSchema.superRefine((data, ctx) => {
  const startDate = parseDate(data.startDate);
  const endDate = parseDate(data.endDate ?? data.dueDate ?? undefined);

  if (!startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['startDate'],
      message: 'Start date must be a valid date.'
    });
  }

  if (!endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endDate'],
      message: 'End date must be a valid date.'
    });
  }

  if (startDate && endDate && endDate < startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endDate'],
      message: 'End date cannot be earlier than start date.'
    });
  }
});

export const updateProjectSchema = projectBaseSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
