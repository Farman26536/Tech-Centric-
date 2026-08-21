import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Project, ProjectInput } from '../../types/project.types';

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
  description: z.string().trim().max(2000, 'Description is too long').optional(),
  deadline: z.string().optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional()
});

type Values = z.infer<typeof schema>;

interface Props {
  initial?: Partial<Project>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (input: ProjectInput) => void | Promise<void>;
  onCancel: () => void;
}

export default function ProjectForm({ initial, submitLabel = 'Create Project', isSubmitting, onSubmit, onCancel }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      deadline: initial?.deadline ? initial.deadline.slice(0, 10) : '',
      status: (initial?.status ?? 'ACTIVE') as any
    }
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (values) =>
        onSubmit({
          title: values.title,
          description: values.description || undefined,
          deadline: values.deadline || undefined,
          status: (values.status || 'ACTIVE') as any
        })
      )}
      className="space-y-5"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="project-title">
          Project Title
        </label>
        <input
          id="project-title"
          {...form.register('title')}
          className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Enter project title"
        />
        {form.formState.errors.title && <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="project-description">
          Description
        </label>
        <textarea
          id="project-description"
          {...form.register('description')}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Describe your project..."
        />
        {form.formState.errors.description && <p className="mt-1 text-xs text-red-600">{form.formState.errors.description.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="project-status">
            Status
          </label>
          <select
            id="project-status"
            {...form.register('status')}
            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="project-deadline">
            Deadline
          </label>
          <input
            id="project-deadline"
            type="date"
            {...form.register('deadline')}
            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
