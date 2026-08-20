import { CalendarDays, UserRound } from 'lucide-react';
import type { Task } from '../../types/teamflow';

interface Props { task: Task; onStatusChange: (status: Task['status']) => void; onOpen: () => void; }

const priorityClass: Record<Task['priority'], string> = {
  LOW: 'border-slate-200 bg-slate-50 text-slate-700',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-800',
  HIGH: 'border-red-200 bg-red-50 text-red-800',
};

const statusOptions: Task['status'][] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

const isOverdue = (task: Task) => Boolean(task.dueDate && task.status !== 'COMPLETED' && new Date(task.dueDate).getTime() < Date.now());

export default function TaskCard({ task, onStatusChange, onOpen }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button type="button" className="block w-full text-left" onClick={onOpen}>
        <div className="flex items-start justify-between gap-3"><h3 className="line-clamp-2 font-semibold text-slate-900">{task.title}</h3><span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold ${priorityClass[task.priority]}`}>{task.priority}</span></div>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{task.description || 'No description provided.'}</p>
        <div className="mt-4 space-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-2"><UserRound size={14} />{task.assignee?.name ?? 'Unassigned'}</div>
          <div className={isOverdue(task) ? 'flex items-center gap-2 font-semibold text-red-600' : 'flex items-center gap-2'}><CalendarDays size={14} />{task.dueDate ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(task.dueDate)) : 'No due date'}{isOverdue(task) ? ' • Overdue' : ''}</div>
        </div>
      </button>
      <div className="mt-4"><label className="sr-only" htmlFor={`status-${task.id}`}>Status for {task.title}</label><select id={`status-${task.id}`} value={task.status} onChange={(e) => onStatusChange(e.target.value as Task['status'])} className="h-9 w-full rounded-lg border border-slate-300 px-2 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200">{statusOptions.map((s) => <option key={s} value={s}>{s === 'TODO' ? 'To Do' : s === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}</option>)}</select></div>
    </article>
  );
}
