import { CalendarDays, FolderKanban, UserRound } from 'lucide-react';
import type { Task, TaskStatus } from '../../types/teamflow';
import CommentSection from './CommentSection';

interface Props { task: Task; currentUserId?: string; isAdmin?: boolean; onStatusChange: (status: TaskStatus) => void; }

const date = (v?: string | null) => v ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(v)) : 'Not set';

export default function TaskDetailsPanel({ task, currentUserId, isAdmin, onStatusChange }: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Task</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{task.title}</h1><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{task.description || 'No description provided.'}</p></div>
          <select aria-label="Task status" value={task.status} onChange={(e) => onStatusChange(e.target.value as TaskStatus)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm font-semibold"><option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select>
        </div>
        <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex gap-2"><FolderKanban size={16} className="mt-0.5 text-slate-400" /><div><dt className="text-xs text-slate-500">Project</dt><dd className="mt-1 text-sm font-medium text-slate-900">{task.project?.title ?? task.projectId}</dd></div></div>
          <div className="flex gap-2"><UserRound size={16} className="mt-0.5 text-slate-400" /><div><dt className="text-xs text-slate-500">Assigned to</dt><dd className="mt-1 text-sm font-medium text-slate-900">{task.assignee?.name ?? task.assignedTo}</dd></div></div>
          <div><dt className="text-xs text-slate-500">Priority</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{task.priority}</dd></div>
          <div className="flex gap-2"><CalendarDays size={16} className="mt-0.5 text-slate-400" /><div><dt className="text-xs text-slate-500">Due date</dt><dd className="mt-1 text-sm font-medium text-slate-900">{date(task.dueDate)}</dd></div></div>
        </dl>
        <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:grid-cols-3"><span>Created: {date(task.createdAt)}</span><span>Updated: {date(task.updatedAt)}</span><span>Completed: {date(task.completedAt)}</span></div>
      </section>
      <section><div className="mb-3"><h2 className="text-lg font-semibold text-slate-900">Comments</h2><p className="text-sm text-slate-500">Notes and discussion for this task.</p></div><CommentSection taskId={task.id} currentUserId={currentUserId} isAdmin={isAdmin} /></section>
    </div>
  );
}
