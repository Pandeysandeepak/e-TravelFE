import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import SearchBusPage from '../pages/public/SearchBusPage';
import LiveTrackingPage from '../pages/public/LiveTrackingPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// User Pages
import UserDashboard from '../pages/user/UserDashboard';

// Owner Pages
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import AddBusPage from '../pages/owner/AddBusPage';
import ManageBusesPage from '../pages/owner/ManageBusesPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AllBusesPage from '../pages/admin/AllBusesPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchBusPage />} />
      <Route path="/tracking/:busId" element={<LiveTrackingPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User Routes */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Owner Routes */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['OWNER']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/add-bus"
        element={
          <ProtectedRoute allowedRoles={['OWNER']}>
            <AddBusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/manage-buses"
        element={
          <ProtectedRoute allowedRoles={['OWNER']}>
            <ManageBusesPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/buses"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AllBusesPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}