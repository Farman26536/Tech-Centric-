import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/TopHeader';
import ErrorBoundary from '../components/layout/ErrorBoundary';

export const AppLayout = () => (
  <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Sidebar />
    <div className="flex-1 min-h-screen flex flex-col min-w-0">
      <TopHeader />
      <main className="flex-1"><section className="container py-6"><ErrorBoundary><Outlet /></ErrorBoundary></section></main>
    </div>
  </div>
);
export default AppLayout;
