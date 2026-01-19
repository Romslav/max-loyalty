import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@components/layout/MainLayout'
import AdminDashboard from '@pages/admin/AdminDashboard'

// Placeholder pages (будут заменены на реальные)
const Placeholder = ({ name }: { name: string }) => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
      <p className="text-lg text-neutral-600">
        {name} страница в разработке...
      </p>
    </div>
  </MainLayout>
)

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route
          path="/admin/dashboard"
          element={
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/admin/restaurants"
          element={<Placeholder name="Рестораны" />}
        />
        <Route path="/admin/guests" element={<Placeholder name="Гости" />} />
        <Route path="/admin/billing" element={<Placeholder name="Биллинг" />} />
        <Route
          path="/admin/analytics"
          element={<Placeholder name="Аналитика" />}
        />
        <Route path="/admin/audit" element={<Placeholder name="Логи аудита" />} />
        <Route
          path="/admin/support"
          element={<Placeholder name="Поддержка" />}
        />
        <Route
          path="/admin/settings"
          element={<Placeholder name="Настройки" />}
        />

        {/* Restaurant Routes */}
        <Route path="/restaurant" element={<Navigate to="/restaurant/dashboard" />} />
        <Route
          path="/restaurant/dashboard"
          element={<Placeholder name="Restaurant Dashboard" />}
        />
        <Route
          path="/restaurant/guests"
          element={<Placeholder name="Гости ресторана" />}
        />
        <Route
          path="/restaurant/operations"
          element={<Placeholder name="Операции" />}
        />

        {/* Guest Routes */}
        <Route path="/guest" element={<Navigate to="/guest/card" />} />
        <Route path="/guest/card" element={<Placeholder name="Моя карта" />} />
        <Route
          path="/guest/profile"
          element={<Placeholder name="Профиль" />}
        />
        <Route
          path="/guest/history"
          element={<Placeholder name="История" />}
        />

        {/* Cashier Routes */}
        <Route path="/cashier" element={<Navigate to="/cashier/scan" />} />
        <Route path="/cashier/scan" element={<Placeholder name="Сканирование" />} />

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
