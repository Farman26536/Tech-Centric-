import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markNotificationRead } from '../../api/features.api';

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['notifications'], queryFn: fetchNotifications, refetchInterval: 60000 });
  const unread = data.filter((n: any) => !n.read).length;
  const mutation = useMutation({ mutationFn: markNotificationRead, onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) });
  return <div className="relative">
    <button aria-label="Notifications" onClick={() => setOpen(v => !v)} className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><Bell size={20}/>{unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] text-white">{unread}</span>}</button>
    {open && <div className="absolute right-0 z-40 mt-2 w-80 rounded-2xl card shadow-xl">
      <div className="flex justify-between border-b p-4 dark:border-slate-700"><b>Notifications</b><span className="text-xs text-slate-500">{unread} unread</span></div>
      <div className="max-h-96 overflow-auto">{data.length ? data.map((n: any) => <div key={n.id} className={`border-b p-4 dark:border-slate-800 ${n.read ? 'opacity-60' : ''}`}><div className="flex justify-between gap-2"><div><b className="text-sm">{n.title}</b><p className="mt-1 text-xs text-slate-500">{n.message.replace(/\s*\([^)]*\)/, '')}</p></div>{!n.read && <button title="Mark read" onClick={() => mutation.mutate(n.id)}><Check size={16}/></button>}</div><time className="mt-2 block text-[11px] text-slate-400">{new Date(n.createdAt).toLocaleString()}</time></div>) : <p className="p-6 text-center text-sm text-slate-500">You're all caught up.</p>}</div>
    </div>}
  </div>;
}
