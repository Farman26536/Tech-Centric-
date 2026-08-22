import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import { AppLayout } from './layouts/AppLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import LandingPage from './pages/landing/LandingPage';
import Projects from './pages/projects/Projects';
import ProjectDetails from './pages/projects/ProjectDetails';
import NewProject from './pages/projects/NewProject';
import Tasks from './pages/tasks/Tasks';
import TaskDetails from './pages/tasks/TaskDetails';
import NewTask from './pages/tasks/NewTask';
import Team from './pages/users/Team';
import Profile from './pages/users/Profile';
import Analytics from './pages/analytics/Analytics';
import Calendar from './pages/calendar/Calendar';
import Reports from './pages/reports/Reports';
import Activity from './pages/activity/Activity';

const UnauthorizedPage = () => (
  <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
    <section>
      <h1>403</h1>
      <p>You don't have permission to access this page.</p>
    </section>
  </main>
);

const LandingRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div role="status">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/403" element={<UnauthorizedPage />} />
        <Route path="/" element={<LandingRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route element={<AdminRoute />}>
              <Route path="/projects/new" element={<NewProject />} />
            </Route>
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/new" element={<NewTask />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/team" element={<Team />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/activity" element={<Activity />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
