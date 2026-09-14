import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { ForgotPasswordPage, StudentStatusPage } from '../pages';
import StudentDashboard from '../pages/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function AppRoutes() {
  useLocation();

  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  };

  const currentUser = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('cpc_user');
    localStorage.removeItem('cpc_token');
    window.location.href = '/login';
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route
          path="/student"
          element={<StudentDashboard user={currentUser} onLogout={handleLogout} initialStep={1} />}
        />
        <Route
          path="/student-dashboard"
          element={<StudentDashboard user={currentUser} onLogout={handleLogout} initialStep={1} />}
        />
        <Route
          path="/student/profile"
          element={<StudentDashboard user={currentUser} onLogout={handleLogout} initialStep={1} />}
        />
        <Route
          path="/student/requirements"
          element={<StudentDashboard user={currentUser} onLogout={handleLogout} initialStep={2} />}
        />
        <Route
          path="/student/status"
          element={<StudentStatusPage user={currentUser} onLogout={handleLogout} />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}