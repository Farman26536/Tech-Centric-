import { X } from 'lucide-react';
import TaskForm from './TaskForm';
import type { ProjectSummary, Task, TaskInput, UserSummary } from '../../types/teamflow';

interface Props {
  open: boolean;
  title: string;
  projects: ProjectSummary[];
  members: UserSummary[];
  initial?: Partial<Task>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (input: TaskInput) => void | Promise<void>;
  onClose: () => void;
}

export default function TaskModal({ open, title, projects, members, initial, submitLabel, isSubmitting, onSubmit, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4"><h2 id="task-modal-title" className="text-lg font-bold text-slate-900">{title}</h2><button type="button" onClick={onClose} aria-label="Close task form" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={19} /></button></div>
        <TaskForm projects={projects} members={members} initial={initial} submitLabel={submitLabel} isSubmitting={isSubmitting} onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
}
