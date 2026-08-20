import { CalendarDays } from 'lucide-react';
import type { DashboardProjectProgress } from '../../types/teamflow';

interface Props { projects: DashboardProjectProgress[]; }

const formatDate = (date?: string | null) => date ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date)) : 'No deadline';

export default function ProjectProgressList({ projects }: Props) {
  if (!projects.length) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No projects found.</div>;
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const percent = Math.min(100, Math.max(0, project.completionPercentage));
        return (
          <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-slate-900">{project.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{project.completedTasks} / {project.totalTasks} tasks completed</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{project.status ?? 'ACTIVE'}</span>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Progress</span><span>{percent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`${project.title} progress`}>
                <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${percent}%` }} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays size={15} aria-hidden="true" />
              <span>Deadline: {formatDate(project.deadline)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
