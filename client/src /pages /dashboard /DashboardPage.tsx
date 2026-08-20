import { AlertCircle, RefreshCw } from 'lucide-react';
import DashboardMetricCards from '../../components/dashboard/DashboardMetricCards';
import ProjectProgressList from '../../components/dashboard/ProjectProgressList';
import TaskCharts from '../../components/dashboard/TaskCharts';
import { useDashboardQuery } from '../../hooks/useTeamFlowQueries';

export default function DashboardPage() {
  const query = useDashboardQuery();

  if (query.isLoading) {
    return <div className="grid gap-6 p-4 sm:p-6"><div className="h-36 animate-pulse rounded-2xl bg-slate-100" /><div className="grid gap-6 lg:grid-cols-2"><div className="h-80 animate-pulse rounded-2xl bg-slate-100" /><div className="h-80 animate-pulse rounded-2xl bg-slate-100" /></div></div>;
  }

  if (query.isError || !query.data) {
    return (
      <div className="m-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 sm:m-6">
        <div className="flex items-start gap-3"><AlertCircle size={20} className="mt-0.5" /><div><h2 className="font-semibold">Unable to load dashboard</h2><p className="mt-1 text-sm">{query.error instanceof Error ? query.error.message : 'Please try again.'}</p></div></div>
        <button type="button" onClick={() => void query.refetch()} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"><RefreshCw size={15} /> Retry</button>
      </div>
    );
  }

  const { data } = query;
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Track team workload, project progress, and delivery health.</p>
      </div>
      <DashboardMetricCards data={data} />
      <TaskCharts charts={data.charts} />
      <section>
        <div className="mb-4"><h2 className="text-lg font-semibold text-slate-900">Project Progress</h2><p className="text-sm text-slate-500">Completion across active and completed projects.</p></div>
        <ProjectProgressList projects={data.projects} />
      </section>
    </div>
  );
}
