import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { PublicRoute } from '../components/PublicRoute'

// Auth pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import UnauthorizedPage from '../components/UnauthorizedPage'

// Admin pages
import AdminDashboard from '../pages/AdminDashboard'
import RestaurantsList from '../pages/RestaurantsList'
import GuestsList from '../pages/GuestsList'
import UserManagement from '../pages/UserManagement'
import AuditLogs from '../pages/AuditLogs'
import SupportTickets from '../pages/SupportTickets'
import SystemSettings from '../pages/SystemSettings'
import AdvancedAnalyticsPage from '../pages/AdvancedAnalyticsPage'
import NotificationSettingsPage from '../pages/NotificationSettingsPage'

// Restaurant pages
import RestaurantDashboard from '../pages/RestaurantDashboard'
import RestaurantGuestsList from '../pages/RestaurantGuestsList'
import AnalyticsPage from '../pages/AnalyticsPage'

// Cashier pages
import CashierDashboard from '../pages/CashierDashboard'
import PointsOperations from '../pages/PointsOperations'
import PointsOperationForm from '../pages/PointsOperationForm'
import ScanCard from '../pages/ScanCard'

// Guest pages
import GuestDashboard from '../pages/GuestDashboard'
import GuestSettings from '../pages/GuestSettings'
import BillingManagement from '../pages/BillingManagement'

// NotFound page
import NotFoundPage from '../pages/NotFoundPage'

/**
 * AppRouter - Main application router with protected routes
 * Routes are protected by RBAC system based on user roles and permissions
 */
export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Auth error pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin routes - requires admin role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/restaurants"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <RestaurantsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/guests"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <GuestsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/support-tickets"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <SupportTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <SystemSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics/advanced"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdvancedAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <NotificationSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Restaurant routes - requires restaurant or admin role */}
        <Route
          path="/restaurant"
          element={
            <ProtectedRoute requiredRoles={['restaurant', 'admin']}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/guests"
          element={
            <ProtectedRoute requiredRoles={['restaurant', 'admin']}>
              <RestaurantGuestsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/analytics"
          element={
            <ProtectedRoute requiredRoles={['restaurant', 'admin']}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/analytics/advanced"
          element={
            <ProtectedRoute requiredRoles={['restaurant', 'admin']}>
              <AdvancedAnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Cashier routes - requires cashier or admin role */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute requiredRoles={['cashier', 'admin']}>
              <CashierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/operations"
          element={
            <ProtectedRoute requiredRoles={['cashier', 'admin']}>
              <PointsOperations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/operations/new"
          element={
            <ProtectedRoute requiredRoles={['cashier', 'admin']}>
              <PointsOperationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/scan"
          element={
            <ProtectedRoute requiredRoles={['cashier', 'admin']}>
              <ScanCard />
            </ProtectedRoute>
          }
        />

        {/* Guest routes - requires guest or higher role */}
        <Route
          path="/guest"
          element={
            <ProtectedRoute requiredRoles={['guest', 'cashier', 'restaurant', 'admin']}>
              <GuestDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/settings"
          element={
            <ProtectedRoute requiredRoles={['guest', 'cashier', 'restaurant', 'admin']}>
              <GuestSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/billing"
          element={
            <ProtectedRoute requiredRoles={['guest', 'cashier', 'restaurant', 'admin']}>
              <BillingManagement />
            </ProtectedRoute>
          }
        />

        {/* Default dashboard route - redirects based on role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navigate to="/guest" replace />
            </ProtectedRoute>
          }
        />

        {/* Root redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 - Not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
