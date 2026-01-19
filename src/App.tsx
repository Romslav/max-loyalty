import React from 'react'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './router'
import ErrorBoundary from './components/ErrorBoundary'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </ErrorBoundary>
  )
}

export default App
