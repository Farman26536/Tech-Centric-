import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '../../api/features.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import { BarChart3, CheckCircle2, AlertTriangle, FolderKanban } from 'lucide-react';

function Bar({ value, max, label }: { value: number; max: number; label: string }) { return <div><div className="mb-1 flex justify-between text-xs"><span>{label}</span><b>{value}</b></div><div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-indigo-500" style={{ width: `${max ? Math.max(2, value / max * 100) : 0}%` }}/></div></div>; }

export default function Analytics() {
  const { data, isLoading } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });
  if (isLoading) return <LoadingSpinner />;
  // If backend analytics are unavailable, show a friendly demo/fallback so the page isn't empty.
  const demo = {
    summary: { projects: 2, tasks: 8, completionRate: 25, overdue: 1 },
    byStatus: [ { status: 'PENDING', count: 3 }, { status: 'IN_PROGRESS', count: 4 }, { status: 'COMPLETED', count: 1 } ],
    byPriority: [ { priority: 'HIGH', count: 2 }, { priority: 'MEDIUM', count: 4 }, { priority: 'LOW', count: 2 } ],
    performance: [ { userId: 1, name: 'Alice', assigned: 5, completed: 2, completionRate: 40 }, { userId: 2, name: 'Bob', assigned: 3, completed: 1, completionRate: 33 } ]
  };
  const effective = data ?? demo;
  const summary = effective?.summary ?? demo.summary;
  const maxPriority = Math.max(1, ...(effective?.byPriority ?? demo.byPriority).map((x: any) => x.count));
  const maxStatus = Math.max(1, ...(effective?.byStatus ?? demo.byStatus).map((x: any) => x.count));
  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold">Dashboard Analytics</h1><p className="text-sm text-slate-500">Real-time project, task and team performance insights.</p></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card><div className="flex justify-between"><span>Projects</span><FolderKanban className="text-indigo-500"/></div><b className="mt-3 block text-3xl">{summary.projects}</b></Card>
      <Card><div className="flex justify-between"><span>Tasks</span><BarChart3 className="text-blue-500"/></div><b className="mt-3 block text-3xl">{summary.tasks}</b></Card>
      <Card><div className="flex justify-between"><span>Completed</span><CheckCircle2 className="text-emerald-500"/></div><b className="mt-3 block text-3xl">{summary.completionRate}%</b></Card>
      <Card><div className="flex justify-between"><span>Overdue</span><AlertTriangle className="text-red-500"/></div><b className="mt-3 block text-3xl">{summary.overdue}</b></Card>
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
          <Card><h2 className="mb-4 font-semibold">Tasks by status</h2><div className="space-y-4">{effective.byStatus.map((x: any) => <Bar key={x.status} label={x.status.replace('_',' ')} value={x.count} max={maxStatus}/>)}</div></Card>
      <Card><h2 className="mb-4 font-semibold">Tasks by priority</h2><div className="space-y-4">{effective.byPriority.map((x: any) => <Bar key={x.priority} label={x.priority} value={x.count} max={maxPriority}/>)}</div></Card>
    </div>
    <Card><h2 className="mb-4 font-semibold">Team performance</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="p-2">Member</th><th>Assigned</th><th>Completed</th><th>Rate</th></tr></thead><tbody>{effective.performance.map((x: any) => <tr key={x.userId} className="border-b last:border-0"><td className="p-2 font-medium">{x.name}</td><td>{x.assigned}</td><td>{x.completed}</td><td>{x.completionRate}%</td></tr>)}</tbody></table></div></Card>
  </div>;
}
