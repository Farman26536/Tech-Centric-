import { AlertTriangle, CheckCircle2, ClipboardList, FolderKanban, LoaderCircle, ListTodo } from 'lucide-react';
import type { DashboardOverview } from '../../types/teamflow';

interface Props { data: DashboardOverview; }

export default function DashboardMetricCards({ data }: Props) {
  const cards = [
    { label: 'Total Projects', value: data.totalProjects, icon: FolderKanban },
    { label: 'Active Projects', value: data.activeProjects, icon: LoaderCircle },
    { label: 'Pending Tasks', value: data.pendingTasks, icon: ListTodo },
    { label: 'In Progress', value: data.inProgressTasks, icon: ClipboardList },
    { label: 'Completed Tasks', value: data.completedTasks, icon: CheckCircle2 },
    { label: 'Overdue Tasks', value: data.overdueTasks, icon: AlertTriangle },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, value, icon: Icon }) => (
        <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
              <Icon size={22} aria-hidden="true" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
