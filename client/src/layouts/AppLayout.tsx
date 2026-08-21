import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, FolderKanban, ListChecks, Users, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const nav = user?.role === 'ADMIN'
    ? [['/dashboard','Dashboard',BarChart3],['/projects','Projects',FolderKanban],['/tasks','Tasks',ListChecks],['/team','Team',Users],['/profile','Profile',UserCircle]]
    : [['/dashboard','Dashboard',BarChart3],['/tasks','My Tasks',ListChecks],['/projects','Projects',FolderKanban],['/profile','Profile',UserCircle]];

  const handleLogout = async () => { await logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {open && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 shadow-sm transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <div><div className="text-xl font-black text-brand-600">TeamFlow</div><div className="text-xs text-slate-400">Team Management Tracker</div></div>
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav aria-label="Primary navigation" className="mt-8 space-y-1">
          {nav.map(([path,label,Icon]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-blue-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}><Icon size={18} aria-hidden="true" />{label}</NavLink>)}
          <button onClick={handleLogout} className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"><LogOut size={18} aria-hidden="true" />Logout</button>
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation menu"><Menu /></button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right"><div className="text-sm font-semibold">{user?.name}</div><div className="text-xs text-slate-400">{user?.role}</div></div>
            <div aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{user?.name?.[0]?.toUpperCase()}</div>
          </div>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
