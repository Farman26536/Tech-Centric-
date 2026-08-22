import { useQuery } from '@tanstack/react-query';
import { Clock3 } from 'lucide-react';
import { fetchActivities } from '../../api/features.api';

export default function ActivityTimeline({ taskId, projectId }: { taskId?: string; projectId?: string }) {
  const { data } = useQuery({ queryKey: ['activities', taskId, projectId], queryFn: () => fetchActivities({ taskId, projectId }) });
  return <section className="rounded-2xl card p-4"><h3 className="mb-4 flex items-center gap-2 font-semibold"><Clock3 size={18}/> Activity & audit history</h3><div className="space-y-4">{data?.data.length ? data.data.map((a: any) => <div key={a.id} className="flex gap-3"><div className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500"/><div><p className="text-sm"><b>{a.actor?.name ?? 'System'}</b> {a.message}</p><time className="text-xs muted">{new Date(a.createdAt).toLocaleString()}</time></div></div>) : <p className="text-sm muted">No activity recorded yet.</p>}</div></section>;
}
