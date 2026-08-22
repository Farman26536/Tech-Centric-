import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '../../api/features.api';
import { fetchProjects } from '../../api/projects.api';
import { fetchTasks } from '../../api/tasks.api';
import { Download, FileText, Table2 } from 'lucide-react';
import Card from '../../components/common/Card';

function csv(rows: any[]) { if (!rows.length) return ''; const keys = Object.keys(rows[0]); return [keys.join(','), ...rows.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g,'""')}"`).join(','))].join('\n'); }
function download(text: string, name: string, type: string) { const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; a.click(); URL.revokeObjectURL(a.href); }

export default function Reports() {
  const { data } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });
  const { data: tasks } = useQuery({ queryKey: ['report-tasks'], queryFn: () => fetchTasks({ limit: 100 }) });
  const { data: projects } = useQuery({ queryKey: ['report-projects'], queryFn: () => fetchProjects(1,100) });
  const print = () => window.print();
  const exportTasks = () => download(csv((tasks?.data ?? []).map((t:any)=>({title:t.title,status:t.status,priority:t.priority,dueDate:t.dueDate,projectId:t.projectId}))), 'teamflow-tasks.csv', 'text/csv');
  const exportProjects = () => download(csv((projects?.data ?? []).map((p:any)=>({name:p.name,status:p.status,startDate:p.startDate,dueDate:p.dueDate}))), 'teamflow-projects.csv', 'text/csv');
  return <div className="space-y-6"><div><h1 className="text-2xl font-semibold">Reports & Export</h1><p className="text-sm text-slate-500">Print to PDF or export Excel-compatible CSV reports.</p></div>
    <div className="grid gap-4 md:grid-cols-3"><Card><FileText className="mb-3 text-indigo-500"/><h2 className="font-semibold">PDF report</h2><p className="mb-4 text-sm text-slate-500">Generate a clean PDF using your browser print dialog.</p><button onClick={print} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Print / Save PDF</button></Card>
    <Card><Table2 className="mb-3 text-emerald-500"/><h2 className="font-semibold">Tasks Excel</h2><p className="mb-4 text-sm text-slate-500">Download CSV and open it directly in Excel.</p><button onClick={exportTasks} className="rounded-lg border px-4 py-2 text-sm font-semibold"><Download className="mr-2 inline" size={15}/>Export tasks</button></Card>
    <Card><Table2 className="mb-3 text-blue-500"/><h2 className="font-semibold">Projects Excel</h2><p className="mb-4 text-sm text-slate-500">Excel-compatible project report.</p><button onClick={exportProjects} className="rounded-lg border px-4 py-2 text-sm font-semibold"><Download className="mr-2 inline" size={15}/>Export projects</button></Card></div>
    <Card><h2 className="font-semibold">Report preview</h2><div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">{[['Projects',data?.summary.projects],['Tasks',data?.summary.tasks],['Completion',`${data?.summary.completionRate ?? 0}%`],['Overdue',data?.summary.overdue]].map(([k,v])=><div key={String(k)} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><div className="text-xs text-slate-500">{k}</div><div className="mt-1 text-2xl font-bold">{v}</div></div>)}</div></Card>
  </div>;
}
