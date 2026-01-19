import React from 'react'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './router'

const App: React.FC = () => {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  )
}

export default App
