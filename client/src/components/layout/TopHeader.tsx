import { useState } from 'react';
import Avatar from '../common/Avatar';
import { Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GlobalSearch from '../features/GlobalSearch';
import NotificationCenter from '../features/NotificationCenter';
import ThemeToggle from '../features/ThemeToggle';

export const TopHeader = () => {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  return <><header className="sticky top-0 z-30 card px-6 py-3 backdrop-blur">
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm font-medium text-slate-500">TeamFlow workspace</div>
      <div className="flex items-center gap-2">
        <button onClick={() => setSearchOpen(true)} className="hidden w-64 items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-200 md:flex dark:bg-slate-800 dark:hover:bg-slate-700"><Search size={17}/> Search projects & tasks <kbd className="ml-auto text-[10px]">⌘K</kbd></button>
        <button aria-label="Search" onClick={() => setSearchOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"><Search size={19}/></button>
        <ThemeToggle/><NotificationCenter/>
        <div className="hidden items-center gap-2 sm:flex"><Avatar name={user?.name ?? 'User'}/><div><div className="text-sm font-medium">{user?.name ?? 'User'}</div><div className="text-xs text-slate-500">{user?.role ?? 'MEMBER'}</div></div></div>
      </div>
    </div>
  </header><GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)}/></>;
};
export default TopHeader;
