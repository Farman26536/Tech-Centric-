import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import { AppLayout } from './layouts/AppLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
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

const FoundationPage = () => (
  <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
    <section style={{ maxWidth: 640, padding: 32 }}>
      <h1>TeamFlow</h1>
      <p>Authentication foundation is ready. Feature pages are provided by the assigned feature branches.</p>
    </section>
  </main>
);

const UnauthorizedPage = () => (
  <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
    <section>
      <h1>403</h1>
      <p>You are not authorized to access this area.</p>
    </section>
  </main>
);

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/403" element={<UnauthorizedPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<NewProject />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/new" element={<NewTask />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/activity" element={<Activity />} />
            <Route element={<AdminRoute />}>
              <Route path="/team" element={<Team />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
