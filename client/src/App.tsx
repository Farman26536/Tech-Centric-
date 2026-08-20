import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';

const FoundationPage = () => (
  <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
    <section style={{ maxWidth: 640, padding: 32 }}>
      <h1>TeamFlow</h1>
      <p>Authentication foundation is ready. Feature pages are provided by the assigned feature branches.</p>
    </section>
  </main>
);

const UnauthorizedPage = () => (
  <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
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
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<FoundationPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin-foundation" element={<FoundationPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
