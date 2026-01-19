import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { useAuthStore } from './stores/authStore';

const App = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
};

export default App;
