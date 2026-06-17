import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import SkeletonLoader from '../components/common/SkeletonLoader';

// Lazy-loaded pages for code splitting
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const EarthquakeListPage = lazy(() => import('../pages/earthquakes/EarthquakeListPage'));
const EarthquakeDetailPage = lazy(() => import('../pages/earthquakes/EarthquakeDetailPage'));
const ReportsListPage = lazy(() => import('../pages/reports/ReportsListPage'));
const AnalyticsDashboard = lazy(() => import('../pages/analytics/AnalyticsDashboard'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface-DEFAULT dark:bg-surface-dark">
    <SkeletonLoader type="page" />
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes (within Dashboard Layout) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="earthquakes" element={<EarthquakeListPage />} />
          <Route path="earthquakes/:id" element={<EarthquakeDetailPage />} />
          <Route path="reports" element={<ReportsListPage />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all: redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
