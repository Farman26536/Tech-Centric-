import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/TopHeader';
import ErrorBoundary from '../components/layout/ErrorBoundary';

export const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-h-screen flex flex-col">
        <TopHeader title="" />

        <main className="flex-1">
          <section className="container py-6">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
