import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Dashboard from '../pages/Dashboard'
import AdvancedAnalyticsPage from '../pages/AdvancedAnalyticsPage'
import NotificationSettingsPage from '../pages/NotificationSettingsPage'

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Phase 3: Advanced Analytics */}
        <Route path="/analytics/:restaurantId" element={<AdvancedAnalyticsPage />} />
        
        {/* Phase 3: Notification Settings */}
        <Route path="/notifications/settings" element={<NotificationSettingsPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
