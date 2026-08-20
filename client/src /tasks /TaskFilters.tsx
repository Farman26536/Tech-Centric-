import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { ProjectSummary, TaskFiltersParams, TaskPriority, TaskStatus, UserSummary } from '../../types/teamflow';

interface Props {
  filters: TaskFiltersParams;
  projects: ProjectSummary[];
  members: UserSummary[];
  onChange: (next: TaskFiltersParams) => void;
}

export default function TaskFilters({ filters, projects, members, onChange }: Props) {
  const set = <K extends keyof TaskFiltersParams>(key: K, value: TaskFiltersParams[K]) => onChange({ ...filters, [key]: value, page: 1 });
  const reset = () => onChange({ page: 1, limit: filters.limit ?? 12 });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><SlidersHorizontal size={17} /><h2 className="font-semibold text-slate-900">Filters</h2></div><button type="button" onClick={reset} className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"><X size={15} /> Reset</button></div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="relative xl:col-span-1"><span className="sr-only">Search tasks</span><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={filters.search ?? ''} onChange={(e) => set('search', e.target.value)} placeholder="Search tasks" className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none ring-offset-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-200" /></label>
        <select aria-label="Status" value={filters.status ?? ''} onChange={(e) => set('status', e.target.value as TaskStatus | '')} className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"><option value="">All statuses</option><option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select>
        <select aria-label="Priority" value={filters.priority ?? ''} onChange={(e) => set('priority', e.target.value as TaskPriority | '')} className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"><option value="">All priorities</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select>
        <select aria-label="Project" value={filters.projectId ?? ''} onChange={(e) => set('projectId', e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"><option value="">All projects</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select>
        <select aria-label="Assigned member" value={filters.assignedTo ?? ''} onChange={(e) => set('assignedTo', e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"><option value="">All members</option>{members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
      </div>
    </section>
  );
}
