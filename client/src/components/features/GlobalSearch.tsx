import { useEffect, useState } from 'react';
import { Search, X, FolderKanban, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { globalSearch } from '../../api/features.api';

export default function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ projects: any[]; tasks: any[] }>({ projects: [], tasks: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(async () => { if (q.trim()) setResults(await globalSearch(q)); else setResults({ projects: [], tasks: [] }); }, 250);
    return () => clearTimeout(timer);
  }, [q, open]);

  if (!open) return null;
  const go = (path: string) => { onClose(); setQ(''); navigate(path); };
  return <div className="fixed inset-0 z-50 bg-black/40 p-4" onMouseDown={onClose}>
    <div className="mx-auto mt-20 max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden" onMouseDown={e => e.stopPropagation()}>
      <div className="flex items-center gap-3 border-b p-4 dark:border-slate-700">
        <Search className="text-slate-400" /><input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects and tasks..." className="flex-1 outline-none bg-transparent" />
        <button onClick={onClose}><X /></button>
      </div>
      <div className="max-h-96 overflow-auto p-2">
        {q && !results.projects.length && !results.tasks.length && <p className="p-6 text-center text-sm text-slate-500">No results found.</p>}
        {results.projects.map(p => <button key={p.id} onClick={() => go(`/projects/${p.id}`)} className="w-full flex gap-3 p-3 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><FolderKanban className="text-indigo-500" /><span><b>{p.name}</b><small className="block text-slate-500">Project</small></span></button>)}
        {results.tasks.map(t => <button key={t.id} onClick={() => go(`/tasks/${t.id}`)} className="w-full flex gap-3 p-3 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><CheckSquare className="text-emerald-500" /><span><b>{t.title}</b><small className="block text-slate-500">{t.project?.name ?? 'Task'}</small></span></button>)}
      </div>
    </div>
  </div>;
}
