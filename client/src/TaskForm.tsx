import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ProjectSummary, Task, TaskInput, TaskPriority, TaskStatus, UserSummary } from '../../types/teamflow';

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
  description: z.string().trim().max(2000, 'Description is too long').optional(),
  projectId: z.string().min(1, 'Project is required'),
  assignedTo: z.string().min(1, 'Assignee is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
  dueDate: z.string().optional(),
});

type Values = z.infer<typeof schema>;

interface Props {
  projects: ProjectSummary[];
  members: UserSummary[];
  initial?: Partial<Task>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (input: TaskInput) => void | Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({ projects, members, initial, submitLabel = 'Save Task', isSubmitting, onSubmit, onCancel }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      projectId: initial?.projectId ?? '',
      assignedTo: initial?.assignedTo ?? '',
      priority: (initial?.priority ?? 'MEDIUM') as TaskPriority,
      status: (initial?.status ?? 'TODO') as TaskStatus,
      dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(async (values) => onSubmit({ ...values, description: values.description || undefined, dueDate: values.dueDate || undefined }))} className="space-y-5">
      <div><label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="task-title">Title</label><input id="task-title" {...form.register('title')} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200" />{form.formState.errors.title && <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p>}</div>
      <div><label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="task-description">Description</label><textarea id="task-description" {...form.register('description')} rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200" />{form.formState.errors.description && <p className="mt-1 text-xs text-red-600">{form.formState.errors.description.message}</p>}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="task-project">Project</label><select id="task-project" {...form.register('projectId')} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"> <option value="">Select project</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select>{form.formState.errors.projectId && <p className="mt-1 text-xs text-red-600">{form.formState.errors.projectId.message}</p>}</div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="task-assignee">Assigned member</label><select id="task-assignee" {...form.register('assignedTo')} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"><option value="">Select member</option>{members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>{form.formState.errors.assignedTo && <p className="mt-1 text-xs text-red-600">{form.formState.errors.assignedTo.message}</p>}</div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="task-priority">Priority</label><select id="task-priority" {...form.register('priority')} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="task-status">Status</label><select id="task-status" {...form.register('status')} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"><option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="task-due-date">Due date</label><input id="task-due-date" type="date" {...form.register('dueDate')} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" /></div>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button disabled={isSubmitting} type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-slate-900 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Saving…' : submitLabel}</button></div>
    </form>
  );
}
