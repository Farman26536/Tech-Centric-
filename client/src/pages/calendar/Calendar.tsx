import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../../api/tasks.api';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

export default function Calendar() {
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const { data } = useQuery({ queryKey: ['calendar-tasks'], queryFn: () => fetchTasks({ limit: 100 }) });
  const tasks = data?.data ?? [];
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = first.getDay();
  const cells = Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => i - offset + 1);
  const grouped = useMemo(() => {
    const m = new Map<number, any[]>();
    tasks.forEach((t: any) => { if (!t.dueDate) return; const d = new Date(t.dueDate); if (d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth()) m.set(d.getDate(), [...(m.get(d.getDate()) ?? []), t]); });
    return m;
  }, [tasks, month]);
  return <div className="space-y-4">
    <div className="flex items-center justify-between"><div><h1 className="flex items-center gap-2 text-2xl font-semibold"><CalendarDays/> Calendar</h1><p className="text-sm text-slate-500">Task due dates and deadlines.</p></div><div className="flex gap-2"><button className="rounded-lg border p-2" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()-1, 1))}><ChevronLeft/></button><button className="rounded-lg border p-2" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()+1, 1))}><ChevronRight/></button></div></div>
    <Card>
      <div className="mb-4 text-center text-lg font-semibold">{month.toLocaleString(undefined,{month:'long',year:'numeric'})}</div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl" style={{backgroundColor: 'var(--app-border)'}}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="p-2 text-center text-xs font-semibold muted">{d}</div>)}
        {cells.map((day, i) => <div key={i} className="min-h-28 p-2 card-day">{day > 0 && day <= days && <><div className="text-xs font-semibold">{day}</div><div className="mt-2 space-y-1">{(grouped.get(day) ?? []).slice(0, 3).map((t: any) => <Link key={t.id} to={`/tasks/${t.id}`} className={`block truncate rounded px-2 py-1 text-[11px] ${t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>{t.title}</Link>)}</div></>}</div>)}
      </div>
    </Card>
  </div>;
}
