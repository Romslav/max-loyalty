import { useCallback } from 'react';
import toast, { Toast, ToastOptions } from 'react-hot-toast';

type NotificationType = 'success' | 'error' | 'info' | 'loading';

interface NotificationOptions extends ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export const useNotification = () => {
  /**
   * Показать уведомление о успехе
   */
  const success = useCallback(
    (message: string, options?: NotificationOptions) => {
      return toast.success(message, {
        duration: 3000,
        position: 'top-right',
        ...options,
      });
    },
    []
  );

  /**
   * Показать уведомление об ошибке
   */
  const error = useCallback(
    (message: string, options?: NotificationOptions) => {
      return toast.error(message, {
        duration: 4000,
        position: 'top-right',
        ...options,
      });
    },
    []
  );

  /**
   * Показать информационное уведомление
   */
  const info = useCallback(
    (message: string, options?: NotificationOptions) => {
      return toast(
        (t) => (
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{message}</span>
          </div>
        ),
        {
          duration: 3000,
          position: 'top-right',
          ...options,
        }
      );
    },
    []
  );

  /**
   * Показать индикатор загрузки
   */
  const loading = useCallback(
    (message: string, options?: NotificationOptions) => {
      return toast.loading(message, {
        duration: Infinity,
        position: 'top-right',
        ...options,
      });
    },
    []
  );

  /**
   * Показать промис
   */
  const promise = useCallback(
    (
      promise: Promise<any>,
      messages: {
        loading: string;
        success: string;
        error: string;
      },
      options?: NotificationOptions
    ) => {
      return toast.promise(
        promise,
        {
          loading: messages.loading,
          success: messages.success,
          error: messages.error,
        },
        {
          duration: 3000,
          position: 'top-right',
          ...options,
        }
      );
    },
    []
  );

  /**
   * Простое уведомление
   */
  const notify = useCallback(
    (message: string, type: NotificationType = 'info', options?: NotificationOptions) => {
      const defaultOptions = {
        duration: 3000,
        position: 'top-right' as const,
        ...options,
      };

      switch (type) {
        case 'success':
          return toast.success(message, defaultOptions);
        case 'error':
          return toast.error(message, defaultOptions);
        case 'loading':
          return toast.loading(message, defaultOptions);
        case 'info':
        default:
          return toast(message, defaultOptions);
      }
    },
    []
  );

  /**
   * Удалить уведомление по ID
   */
  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }, []);

  /**
   * Обновить существующее уведомление
   */
  const update = useCallback(
    (
      toastId: string,
      options: {
        render?: string | React.ReactNode;
        type?: NotificationType;
        isLoading?: boolean;
        duration?: number;
      }
    ) => {
      toast.dismiss(toastId);
      if (options.render) {
        const { render, type = 'info', duration = 3000 } = options;
        toast[type](render, { duration, position: 'top-right' });
      }
    },
    []
  );

  /**
   * Удалить все уведомления
   */
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  /**
   * Комбинированное уведомление для асинхронных операций
   */
  const asyncNotify = useCallback(
    async <T,>(
      asyncFunction: () => Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      }
    ): Promise<{ success: boolean; data?: T; error?: string }> => {
      const loadingId = toast.loading(messages.loading, { position: 'top-right' });

      try {
        const data = await asyncFunction();
        toast.dismiss(loadingId);
        toast.success(messages.success, { position: 'top-right' });
        return { success: true, data };
      } catch (err: any) {
        toast.dismiss(loadingId);
        const errorMessage = err?.message || messages.error;
        toast.error(errorMessage, { position: 'top-right' });
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  return {
    success,
    error,
    info,
    loading,
    promise,
    notify,
    dismiss,
    update,
    dismissAll,
    asyncNotify,
  };
};
