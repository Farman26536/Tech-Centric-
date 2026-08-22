import { Archive, Calendar, Folder } from 'lucide-react';
import type { Project } from '../../types/project.types';

interface Props {
  project: Project;
  taskCount?: number;
  onOpen: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusColors: Record<Project['status'], string> = {
  // Make ACTIVE status visually match the sidebar active style (indigo accent)
  ACTIVE: 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 pl-2 shadow-sm',
  ON_HOLD: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  COMPLETED: 'border-blue-200 bg-blue-50 text-blue-700',
  ARCHIVED: 'border-gray-200 bg-gray-50 text-gray-700'
};

export default function ProjectCard({ project, taskCount = 0, onOpen, onEdit, onDelete }: Props) {
  const isOverdue = project.deadline && new Date(project.deadline).getTime() < Date.now() && project.status !== 'COMPLETED';

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button type="button" className="block w-full text-left" onClick={onOpen}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Folder className="mt-1 shrink-0 text-slate-400" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{project.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.description || 'No description'}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${statusColors[project.status]}`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="font-medium">{taskCount} tasks</span>
            {project.deadline && (
              <div className={isOverdue ? 'font-semibold text-red-600' : ''}>
                <Calendar size={14} className="mb-1 inline mr-1" />
                {new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(new Date(project.deadline))}
              </div>
            )}
          </div>
        </div>
      </button>
      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
