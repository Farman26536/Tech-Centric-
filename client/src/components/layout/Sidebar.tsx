import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../common/Avatar';
import { Home, FolderKanban, CheckSquare, Users, User, LogOut, BarChart3, CalendarDays, FileDown, Activity } from 'lucide-react';

const NavItem: React.FC<{ to:string; icon:React.ReactNode; label:string }> = ({to,icon,label}) => {
  const loc=useLocation(); const active=loc.pathname===to || (to!=='/' && loc.pathname.startsWith(to));
  return <Link to={to} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${active?'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50':'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}><span className="w-6">{icon}</span>{label}</Link>;
};
export const Sidebar=()=>{
 const {user,logout}=useAuth(); const navigate=useNavigate();
 const signOut=async()=>{try{await logout()}finally{navigate('/login',{replace:true})}};
 return <aside className="hidden w-64 shrink-0 border-r bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col lg:min-h-screen lg:sticky lg:top-0">
   <div className="p-6 flex items-center gap-3"><div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">TF</div><div><div className="text-lg font-semibold">TeamFlow</div><div className="text-xs text-slate-500">Project Tracker</div></div></div>
   <nav className="px-4 space-y-1"><NavItem to="/dashboard" icon={<Home size={18}/>} label="Dashboard"/><NavItem to="/projects" icon={<FolderKanban size={18}/>} label="Projects"/><NavItem to="/tasks" icon={<CheckSquare size={18}/>} label="Tasks"/><NavItem to="/calendar" icon={<CalendarDays size={18}/>} label="Calendar"/><NavItem to="/analytics" icon={<BarChart3 size={18}/>} label="Analytics"/><NavItem to="/activity" icon={<Activity size={18}/>} label="Activity"/><NavItem to="/reports" icon={<FileDown size={18}/>} label="Reports"/><NavItem to="/team" icon={<Users size={18}/>} label="Team"/><NavItem to="/profile" icon={<User size={18}/>} label="Profile"/></nav>
   <div className="mt-auto p-4 border-t dark:border-slate-800"><div className="flex items-center gap-3"><Avatar name={user?.name ?? 'User'}/><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{user?.name ?? 'User'}</div><div className="text-xs text-slate-500">{user?.role ?? 'MEMBER'}</div></div><button title="Sign out" onClick={signOut}><LogOut size={17}/></button></div></div>
 </aside>;
};
export default Sidebar;
