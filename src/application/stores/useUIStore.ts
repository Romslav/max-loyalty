/**
 * UI Store - Управление состоянием интерфейса
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Theme = 'light' | 'dark' | 'auto';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  closable?: boolean;
}

export const useUIStore = defineStore('ui', () => {
  // State
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'auto');
  const sidebarOpen = ref(true);
  const mobileMenuOpen = ref(false);
  const notifications = ref<Notification[]>([]);
  const isLoading = ref(false);
  const loadingMessage = ref('');
  const confirmDialog = ref({
    open: false,
    title: '',
    message: '',
    confirmText: 'Ок',
    cancelText: 'Отменить',
    onConfirm: (() => {}) as () => void,
    onCancel: (() => {}) as () => void,
  });

  // Actions
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    updateDocumentTheme();
  };

  const updateDocumentTheme = () => {
    const htmlElement = document.documentElement;
    const isDark =
      theme.value === 'dark' ||
      (theme.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      htmlElement.setAttribute('data-color-scheme', 'dark');
    } else {
      htmlElement.setAttribute('data-color-scheme', 'light');
    }
  };

  const toggleTheme = () => {
    if (theme.value === 'light') {
      setTheme('dark');
    } else if (theme.value === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  const setSidebarOpen = (open: boolean) => {
    sidebarOpen.value = open;
  };

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const setMobileMenuOpen = (open: boolean) => {
    mobileMenuOpen.value = open;
  };

  const addNotification = (
    type: NotificationType,
    message: string,
    options?: { title?: string; duration?: number; closable?: boolean }
  ) => {
    const id = 'notif-' + Date.now();
    const notification: Notification = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? 3000,
      closable: options?.closable ?? true,
    };

    notifications.value.push(notification);

    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  const showSuccess = (message: string, title?: string) => {
    return addNotification('success', message, { title });
  };

  const showError = (message: string, title?: string) => {
    return addNotification('error', message, { title, duration: 5000 });
  };

  const showWarning = (message: string, title?: string) => {
    return addNotification('warning', message, { title });
  };

  const showInfo = (message: string, title?: string) => {
    return addNotification('info', message, { title });
  };

  const setLoading = (loading: boolean, message?: string) => {
    isLoading.value = loading;
    loadingMessage.value = message || '';
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: { confirmText?: string; cancelText?: string }
  ) => {
    confirmDialog.value = {
      open: true,
      title,
      message,
      confirmText: options?.confirmText || 'Ок',
      cancelText: options?.cancelText || 'Отменить',
      onConfirm: () => {
        onConfirm();
        confirmDialog.value.open = false;
      },
      onCancel: () => {
        onCancel?.();
        confirmDialog.value.open = false;
      },
    };
  };

  const closeConfirm = () => {
    confirmDialog.value.open = false;
  };

  return {
    // State
    theme,
    sidebarOpen,
    mobileMenuOpen,
    notifications,
    isLoading,
    loadingMessage,
    confirmDialog,
    // Actions
    setTheme,
    toggleTheme,
    updateDocumentTheme,
    toggleSidebar,
    setSidebarOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    setLoading,
    showConfirm,
    closeConfirm,
  };
});
