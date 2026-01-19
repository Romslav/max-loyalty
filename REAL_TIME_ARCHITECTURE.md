# 🔔 Real-Time & Notifications Architecture

**Версия:** 1.0
**Дата:** 2026-01-19
**Статус:** Design Phase 🔵

---

## 📋 Содержание

1. [Архитектура](#архитектура)
2. [API Контракты](#api-контракты)
3. [Frontend Реализация](#frontend-реализация)
4. [Backend Реализация](#backend-реализация)
5. [WebSocket События](#websocket-события)
6. [Примеры Использования](#примеры-использования)
7. [Deployment & Масштабирование](#deployment--масштабирование)

---

## 🏗️ Архитектура

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        Max Loyalty Platform                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   Frontend (React)       │
│  ┌────────────────────┐  │
│  │ WebSocket Client   │  │  Connects to
│  │ notificationStore  │◄──┼──► WebSocket Server
│  │ EventEmitter       │  │  (Node.js)
│  └────────────────────┘  │
│         │                │
│         ▼                │
│  ┌────────────────────┐  │
│  │ UI Components      │  │  Real-time updates
│  │ - Toast Notif      │  │  - Points added/redeemed
│  │ - Counters         │  │  - New guests
│  │ - Charts           │  │  - Status changes
│  └────────────────────┘  │
└──────────────────────────┘
         ▲
         │ HTTP
         │
┌────────▼─────────────────────────────────────────┐
│        Backend (Express/Node.js)                 │
│  ┌──────────────────────────────────────────┐   │
│  │ WebSocket Server (Socket.io / ws)        │   │
│  │  - Connection Management                 │   │
│  │  - Room/Channel Broadcasting             │   │
│  │  - Event Handling                        │   │
│  └──────────────────────────────────────────┘   │
│         │                                        │
│         ▼                                        │
│  ┌──────────────────────────────────────────┐   │
│  │ Event Bus / Message Queue (Redis/RabbitMQ)  │   │
│  │  - Event Distribution                   │   │
│  │  - Horizontal Scaling                   │   │
│  └──────────────────────────────────────────┘   │
│         │                                        │
│         ▼                                        │
│  ┌──────────────────────────────────────────┐   │
│  │ Database                                 │   │
│  │  - Notifications table                   │   │
│  │  - Transaction logs                      │   │
│  │  - User subscriptions                    │   │
│  └──────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘

┌───────────────────────────────────────┐
│   External Services (Optional)         │
│  - Email Service (SendGrid/Postmark)  │
│  - SMS Service (Twilio)               │
│  - Push Notifications (Firebase/OneSignal) │
└───────────────────────────────────────┘
```

### Layer Architecture

```
Frontend Layer
├── WebSocket Manager (singleton)
├── Event Store (Zustand)
├── Notification Service
└── UI Components
    ├── Toast Notifications
    ├── Notification Center
    ├── Real-time Counters
    └── Activity Feed

Backend Layer
├── WebSocket Server
├── Event Emitter
├── Notification Service
├── Message Queue Worker
└── Database Layer
    ├── Notifications
    ├── User Preferences
    ├── Transaction Logs
    └── User Sessions
```

---

## 🔌 API Контракты

### WebSocket Events (Client → Server)

#### 1. Connection

```typescript
// Клиент подключается с токеном
Socket.connect()
→ Server получает authorization header с JWT

// Server проверяет токен и добавляет сокет в room
route: `restaurant:${restaurantId}`
route: `user:${userId}`
route: `admin`
```

#### 2. Subscribe Events

```typescript
// Guest подписывается на изменения своей карты
{
  event: 'subscribe',
  type: 'guest_card',
  data: {
    guestId: 'uuid',
    cardId: 'uuid'
  }
}

// Restaurant подписывается на операции поинтов
{
  event: 'subscribe',
  type: 'points_operations',
  data: {
    restaurantId: 'uuid'
  }
}

// Admin подписывается на все события
{
  event: 'subscribe',
  type: 'system_events',
  data: {}
}
```

#### 3. Action Events

```typescript
// Guest запрашивает подтверждение действия
{
  event: 'action_confirm',
  data: {
    actionId: 'uuid',
    action: 'points_redeem',
    amount: 500
  }
}
```

### WebSocket Events (Server → Client)

#### 1. Connection Status

```typescript
// Успешное подключение
{
  event: 'connected',
  data: {
    userId: 'uuid',
    role: 'admin|restaurant|cashier|guest',
    timestamp: 1234567890,
    serverId: 'ws-server-1'
  }
}

// Disconnection
{
  event: 'disconnected',
  data: {
    reason: 'client_disconnect|server_restart|timeout',
    reconnectDelay: 3000
  }
}
```

#### 2. Points Operations

```typescript
// Points Added
{
  event: 'points_added',
  data: {
    guestId: 'uuid',
    cardId: 'uuid',
    amount: 100,
    newBalance: 500,
    restaurantId: 'uuid',
    restaurantName: 'Restaurant Name',
    transactionId: 'uuid',
    timestamp: 1234567890,
    description: 'Purchase at Restaurant Name'
  }
}

// Points Redeemed
{
  event: 'points_redeemed',
  data: {
    guestId: 'uuid',
    cardId: 'uuid',
    amount: 200,
    newBalance: 300,
    restaurantId: 'uuid',
    rewardName: 'Free Coffee',
    transactionId: 'uuid',
    timestamp: 1234567890
  }
}

// Points Expired
{
  event: 'points_expired',
  data: {
    guestId: 'uuid',
    amount: 50,
    newBalance: 250,
    expiryDate: '2026-02-19',
    reason: 'Inactivity for 6 months'
  }
}
```

#### 3. Guest Card Events

```typescript
// New Guest Registered
{
  event: 'guest_registered',
  data: {
    guestId: 'uuid',
    guestName: 'John Doe',
    email: 'john@example.com',
    restaurantId: 'uuid',
    timestamp: 1234567890
  }
}

// Guest Card Updated
{
  event: 'guest_card_updated',
  data: {
    guestId: 'uuid',
    cardId: 'uuid',
    changes: {
      status: 'active|suspended|blocked',
      tier: 'bronze|silver|gold|platinum'
    },
    timestamp: 1234567890
  }
}

// New Card Created
{
  event: 'card_created',
  data: {
    guestId: 'uuid',
    cardId: 'uuid',
    restaurantId: 'uuid',
    restaurantName: 'Restaurant Name',
    qrCode: 'data:image/png;base64,...',
    initialPoints: 0,
    timestamp: 1234567890
  }
}
```

#### 4. Restaurant Events

```typescript
// New Guest Joined Restaurant
{
  event: 'restaurant_guest_joined',
  data: {
    restaurantId: 'uuid',
    guestId: 'uuid',
    guestName: 'John Doe',
    cardId: 'uuid',
    timestamp: 1234567890
  }
}

// Restaurant Status Changed
{
  event: 'restaurant_status_changed',
  data: {
    restaurantId: 'uuid',
    status: 'active|inactive|maintenance',
    reason: 'Maintenance window',
    estimatedRestore: 1234567890
  }
}

// New Transaction in Restaurant
{
  event: 'restaurant_transaction',
  data: {
    restaurantId: 'uuid',
    transactionId: 'uuid',
    guestId: 'uuid',
    guestName: 'John Doe',
    type: 'purchase|redemption',
    amount: 150,
    totalToday: 5000,
    timestamp: 1234567890
  }
}
```

#### 5. Admin Events

```typescript
// System Alert
{
  event: 'system_alert',
  data: {
    level: 'info|warning|error|critical',
    title: 'Alert Title',
    message: 'Alert Message',
    source: 'system|restaurant|guest|cashier',
    timestamp: 1234567890
  }
}

// Admin Notification
{
  event: 'admin_notification',
  data: {
    notificationId: 'uuid',
    type: 'user_created|restaurant_joined|fraud_detected|high_volume',
    title: 'New User Registered',
    message: 'User John Doe has registered',
    actionRequired: false,
    priority: 'low|medium|high|critical',
    timestamp: 1234567890
  }
}
```

#### 6. Error Events

```typescript
// Connection Error
{
  event: 'error',
  data: {
    code: 'UNAUTHORIZED|NOT_FOUND|SERVER_ERROR|RATE_LIMITED',
    message: 'User not authorized',
    timestamp: 1234567890
  }
}

// Notification Delivery Failed
{
  event: 'delivery_failed',
  data: {
    notificationId: 'uuid',
    reason: 'User offline|Delivery service error',
    retryCount: 3,
    nextRetry: 1234567890
  }
}
```

---

## 🎨 Frontend Реализация

### 1. WebSocket Manager (singleton)

```typescript
// src/services/websocketService.ts

import { io, Socket } from 'socket.io-client';
import { useNotificationStore } from '@stores/notificationStore';
import { getErrorMessage } from '@utils/errorHandler';

interface WebSocketConfig {
  url: string;
  reconnection: boolean;
  reconnectionDelay: number;
  reconnectionDelayMax: number;
  maxReconnectionAttempts: number;
}

class WebSocketService {
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageQueue: any[] = [];
  private isConnected: boolean = false;

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      url: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 5,
      ...config,
    };
  }

  /**
   * Connect to WebSocket server
   * Requires valid JWT token in localStorage
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket?.connected) {
          resolve();
          return;
        }

        this.socket = io(this.config.url, {
          auth: {
            token,
          },
          reconnection: this.config.reconnection,
          reconnectionDelay: this.config.reconnectionDelay,
          reconnectionDelayMax: this.config.reconnectionDelayMax,
          maxReconnectionAttempts: this.config.maxReconnectionAttempts,
          transports: ['websocket', 'polling'],
        });

        this.setupEventListeners();

        this.socket.on('connect', () => {
          this.isConnected = true;
          console.log('[WebSocket] Connected');
          this.flushMessageQueue();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('[WebSocket] Connection error:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      console.log('[WebSocket] Disconnected');
    }
  }

  /**
   * Subscribe to specific event channel
   */
  subscribe(
    type: 'guest_card' | 'points_operations' | 'system_events' | 'restaurant_transactions',
    data: Record<string, any>
  ): void {
    this.emit('subscribe', { type, data });
  }

  /**
   * Unsubscribe from event channel
   */
  unsubscribe(type: string, data: Record<string, any>): void {
    this.emit('unsubscribe', { type, data });
  }

  /**
   * Listen to specific event
   */
  on(
    event: string,
    callback: (data: any) => void
  ): () => void {
    if (!this.socket) {
      console.warn('[WebSocket] Socket not initialized');
      return () => {};
    }

    this.socket.on(event, callback);

    // Return unsubscribe function
    return () => {
      this.socket?.off(event, callback);
    };
  }

  /**
   * Listen to event once
   */
  once(
    event: string,
    callback: (data: any) => void
  ): void {
    if (!this.socket) {
      console.warn('[WebSocket] Socket not initialized');
      return;
    }

    this.socket.once(event, callback);
  }

  /**
   * Emit event to server
   */
  emit(event: string, data?: any): void {
    if (!this.socket) {
      console.warn('[WebSocket] Socket not initialized');
      return;
    }

    if (this.isConnected) {
      this.socket.emit(event, data);
    } else {
      // Queue message if not connected
      this.messageQueue.push({ event, data });
      console.log('[WebSocket] Message queued:', event);
    }
  }

  /**
   * Emit event and wait for response
   */
  async request<T = any>(
    event: string,
    data?: any,
    timeout: number = 5000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const timer = setTimeout(
        () => reject(new Error('Request timeout')),
        timeout
      );

      this.socket.emit(event, data, (response: T) => {
        clearTimeout(timer);
        resolve(response);
      });
    });
  }

  /**
   * Get connection status
   */
  isActive(): boolean {
    return this.isConnected && this.socket?.connected;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    const notificationStore = useNotificationStore();

    // System events
    this.on('connected', (data) => {
      console.log('[WebSocket] Server connected:', data);
      notificationStore.addSystemEvent({
        type: 'connected',
        message: 'Connected to server',
        timestamp: Date.now(),
      });
    });

    this.on('disconnected', (data) => {
      this.isConnected = false;
      notificationStore.addSystemEvent({
        type: 'disconnected',
        message: `Disconnected: ${data.reason}`,
        timestamp: Date.now(),
      });
    });

    // Error handling
    this.on('error', (data) => {
      console.error('[WebSocket] Error:', data);
      notificationStore.showNotification({
        type: 'error',
        title: 'Connection Error',
        message: data.message,
        duration: 5000,
      });
    });

    // Points operations
    this.on('points_added', (data) => {
      notificationStore.addNotification({
        id: data.transactionId,
        type: 'points_added',
        title: 'Points Added! 🎉',
        message: `+${data.amount} points at ${data.restaurantName}`,
        data,
        read: false,
        timestamp: data.timestamp,
      });
      notificationStore.showNotification({
        type: 'success',
        title: 'Points Added',
        message: `+${data.amount} points`,
        duration: 3000,
      });
    });

    this.on('points_redeemed', (data) => {
      notificationStore.addNotification({
        id: data.transactionId,
        type: 'points_redeemed',
        title: 'Points Redeemed! ✨',
        message: `${data.rewardName} redeemed`,
        data,
        read: false,
        timestamp: data.timestamp,
      });
      notificationStore.showNotification({
        type: 'success',
        title: 'Reward Redeemed',
        message: data.rewardName,
        duration: 3000,
      });
    });

    // Guest card events
    this.on('card_created', (data) => {
      notificationStore.addNotification({
        id: data.cardId,
        type: 'card_created',
        title: 'New Loyalty Card 💳',
        message: `Card created at ${data.restaurantName}`,
        data,
        read: false,
        timestamp: data.timestamp,
      });
    });
  }

  /**
   * Flush queued messages after connection
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const { event, data } = this.messageQueue.shift();
      this.emit(event, data);
    }
    console.log('[WebSocket] Message queue flushed');
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
```

### 2. Notification Store (Zustand)

```typescript
// src/stores/notificationStore.ts

import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'points_added' | 'points_redeemed' | 'card_created' | 'guest_registered' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  timestamp: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface SystemEvent {
  type: 'connected' | 'disconnected' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export interface NotificationState {
  // Notifications (persistent in DB)
  notifications: Notification[];
  unreadCount: number;

  // Toasts (temporary, UI-only)
  toasts: Toast[];

  // System events
  systemEvents: SystemEvent[];

  // Settings
  isEnabled: boolean;
  soundEnabled: boolean;
  emailNotifications: boolean;

  // Actions
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;

  showNotification: (toast: Toast) => void;
  hideNotification: (id: string) => void;
  clearToasts: () => void;

  addSystemEvent: (event: SystemEvent) => void;
  clearSystemEvents: () => void;

  toggleNotifications: () => void;
  toggleSound: () => void;
  toggleEmailNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  toasts: [],
  systemEvents: [],
  isEnabled: true,
  soundEnabled: true,
  emailNotifications: false,

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Play sound if enabled
    if (get().soundEnabled) {
      playNotificationSound();
    }
  },

  markAsRead: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (!notification || notification.read) return state;

      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  deleteNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      const wasUnread = notification && !notification.read;

      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      };
    });
  },

  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  showNotification: (toast) => {
    const id = Date.now().toString();
    const toastWithId = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, toastWithId],
    }));

    // Auto-hide after duration
    if (toast.duration) {
      setTimeout(() => get().hideNotification(id), toast.duration);
    }
  },

  hideNotification: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  addSystemEvent: (event) => {
    set((state) => ({
      systemEvents: [event, ...state.systemEvents].slice(0, 50), // Keep last 50
    }));
  },

  clearSystemEvents: () => {
    set({ systemEvents: [] });
  },

  toggleNotifications: () => {
    set((state) => ({
      isEnabled: !state.isEnabled,
    }));
  },

  toggleSound: () => {
    set((state) => ({
      soundEnabled: !state.soundEnabled,
    }));
  },

  toggleEmailNotifications: () => {
    set((state) => ({
      emailNotifications: !state.emailNotifications,
    }));
  },
}));

function playNotificationSound(): void {
  // TODO: Implement sound playback
  // const audio = new Audio('/sounds/notification.mp3');
  // audio.play().catch(err => console.error('Failed to play sound:', err));
}
```

### 3. Notification Service Hook

```typescript
// src/services/notificationService.ts

import { useEffect } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useNotificationStore } from '@stores/notificationStore';
import { websocketService } from './websocketService';

/**
 * Hook for managing WebSocket connections and notifications
 * Call this in App.tsx or main layout component
 */
export function useNotifications() {
  const { user, token } = useAuthStore();
  const notificationStore = useNotificationStore();

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const setupWebSocket = async () => {
      try {
        await websocketService.connect(token);
        console.log('[Notifications] WebSocket connected');

        // Subscribe to user's specific channels based on role
        if (user.role === 'admin') {
          websocketService.subscribe('system_events', {});
        } else if (user.role === 'restaurant') {
          websocketService.subscribe('points_operations', {
            restaurantId: user.restaurantId,
          });
        } else if (user.role === 'guest') {
          websocketService.subscribe('guest_card', {
            guestId: user.id,
          });
        } else if (user.role === 'cashier') {
          websocketService.subscribe('points_operations', {
            restaurantId: user.restaurantId,
          });
        }
      } catch (error) {
        console.error('[Notifications] Connection failed:', error);
        notificationStore.showNotification({
          type: 'error',
          title: 'Connection Failed',
          message: 'Could not connect to real-time server',
          duration: 5000,
        });
      }
    };

    setupWebSocket();

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, [user, token]);

  return {
    isConnected: websocketService.isActive(),
    subscribe: websocketService.subscribe.bind(websocketService),
    unsubscribe: websocketService.unsubscribe.bind(websocketService),
    emit: websocketService.emit.bind(websocketService),
  };
}
```

### 4. Toast Notification Component

```typescript
// src/components/notifications/ToastContainer.tsx

import { useNotificationStore } from '@stores/notificationStore';
import { useEffect } from 'react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onClose: (id: string) => void;
}

function Toast({ id, type, title, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }[type];

  return (
    <div
      className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300`}
    >
      <span className="text-xl">{icon}</span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-auto text-xl opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useNotificationStore((state) => state.toasts);
  const hideNotification = useNotificationStore(
    (state) => state.hideNotification
  );

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={hideNotification}
        />
      ))}
    </div>
  );
}
```

### 5. Notification Center Component

```typescript
// src/components/notifications/NotificationCenter.tsx

import { useNotificationStore } from '@stores/notificationStore';
import { useState } from 'react';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const deleteNotification = useNotificationStore(
    (state) => state.deleteNotification
  );

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-gray-50">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <time className="text-xs text-gray-500 mt-1 block">
                        {new Date(notification.timestamp).toLocaleString()}
                      </time>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🖥️ Backend Реализация

### Node.js + Express + Socket.io Setup

```typescript
// backend/src/websocket/websocketServer.ts

import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { notificationQueue } from '../queue/notificationQueue';

export interface AuthSocket extends Socket {
  userId: string;
  role: 'admin' | 'restaurant' | 'cashier' | 'guest';
  restaurantId?: string;
}

export class WebSocketServer {
  private io: SocketIOServer;
  private connectedUsers = new Map<string, Set<string>>();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      pingInterval: 25000,
      pingTimeout: 20000,
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  /**
   * Setup authentication middleware
   */
  private setupMiddleware(): void {
    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'secret'
        ) as any;

        (socket as AuthSocket).userId = decoded.id;
        (socket as AuthSocket).role = decoded.role;
        (socket as AuthSocket).restaurantId = decoded.restaurantId;

        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  /**
   * Setup main event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const authSocket = socket as AuthSocket;
      console.log(`[WebSocket] User ${authSocket.userId} connected`);

      // Add user to connectedUsers map
      if (!this.connectedUsers.has(authSocket.userId)) {
        this.connectedUsers.set(authSocket.userId, new Set());
      }
      this.connectedUsers.get(authSocket.userId)?.add(socket.id);

      // Send connection confirmation
      socket.emit('connected', {
        userId: authSocket.userId,
        role: authSocket.role,
        timestamp: Date.now(),
        serverId: process.env.SERVER_ID || 'ws-server-1',
      });

      // Subscribe handler
      socket.on(
        'subscribe',
        (data: { type: string; data: Record<string, any> }) => {
          this.handleSubscribe(authSocket, data);
        }
      );

      // Unsubscribe handler
      socket.on('unsubscribe', (data) => {
        this.handleUnsubscribe(authSocket, data);
      });

      // Disconnect handler
      socket.on('disconnect', () => {
        console.log(`[WebSocket] User ${authSocket.userId} disconnected`);
        const userSockets = this.connectedUsers.get(authSocket.userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            this.connectedUsers.delete(authSocket.userId);
          }
        }
      });
    });
  }

  /**
   * Handle subscription to event channels
   */
  private handleSubscribe(
    socket: AuthSocket,
    data: { type: string; data: Record<string, any> }
  ): void {
    const { type, data: subscriptionData } = data;

    try {
      switch (type) {
        case 'guest_card':
          // Subscribe to guest's own card updates
          socket.join(`guest:${subscriptionData.guestId}`);
          console.log(`[Subscribe] User ${socket.userId} joined guest channel`);
          break;

        case 'points_operations':
          // Subscribe to restaurant's points operations
          socket.join(
            `restaurant:${subscriptionData.restaurantId}:points`
          );
          console.log(
            `[Subscribe] User ${socket.userId} joined points channel`
          );
          break;

        case 'system_events':
          // Admin only - subscribe to all system events
          if (socket.role === 'admin') {
            socket.join('admin:events');
            console.log(
              `[Subscribe] Admin ${socket.userId} joined system events`
            );
          } else {
            socket.emit('error', {
              code: 'UNAUTHORIZED',
              message: 'Only admins can subscribe to system events',
            });
          }
          break;

        default:
          socket.emit('error', {
            code: 'INVALID_SUBSCRIPTION',
            message: `Unknown subscription type: ${type}`,
          });
      }
    } catch (error) {
      console.error('[Subscribe] Error:', error);
      socket.emit('error', {
        code: 'SUBSCRIBE_ERROR',
        message: 'Failed to subscribe',
      });
    }
  }

  /**
   * Handle unsubscription
   */
  private handleUnsubscribe(
    socket: AuthSocket,
    data: { type: string; data: Record<string, any> }
  ): void {
    const { type, data: subscriptionData } = data;

    switch (type) {
      case 'guest_card':
        socket.leave(`guest:${subscriptionData.guestId}`);
        break;
      case 'points_operations':
        socket.leave(
          `restaurant:${subscriptionData.restaurantId}:points`
        );
        break;
      case 'system_events':
        socket.leave('admin:events');
        break;
    }
  }

  /**
   * Broadcast points added event
   */
  broadcastPointsAdded(restaurantId: string, data: any): void {
    this.io
      .to(`restaurant:${restaurantId}:points`)
      .to(`guest:${data.guestId}`)
      .emit('points_added', data);
  }

  /**
   * Broadcast points redeemed event
   */
  broadcastPointsRedeemed(restaurantId: string, data: any): void {
    this.io
      .to(`restaurant:${restaurantId}:points`)
      .to(`guest:${data.guestId}`)
      .emit('points_redeemed', data);
  }

  /**
   * Send notification to specific user
   */
  sendToUser(userId: string, event: string, data: any): void {
    const userSockets = this.connectedUsers.get(userId);
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.io.to(socketId).emit(event, data);
      });
    }
  }

  /**
   * Broadcast to all connected admins
   */
  broadcastToAdmins(event: string, data: any): void {
    this.io.to('admin:events').emit(event, data);
  }

  /**
   * Get server stats
   */
  getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      totalSockets: this.io.engine.clientsCount,
      rooms: Array.from(this.io.sockets.adapter.rooms.keys()),
    };
  }
}
```

### Event Handlers

```typescript
// backend/src/websocket/eventHandlers.ts

import { Repository } from 'typeorm';
import { WebSocketServer } from './websocketServer';
import { Transaction } from '../models/Transaction';

export class EventHandlers {
  constructor(
    private wsServer: WebSocketServer,
    private transactionRepo: Repository<Transaction>
  ) {}

  /**
   * Handle points added event from API
   */
  async onPointsAdded(transactionId: string): Promise<void> {
    try {
      const transaction = await this.transactionRepo.findOne({
        where: { id: transactionId },
        relations: ['guest', 'restaurant'],
      });

      if (!transaction) return;

      this.wsServer.broadcastPointsAdded(transaction.restaurant.id, {
        guestId: transaction.guest.id,
        cardId: transaction.guest.cardId,
        amount: transaction.amount,
        newBalance: transaction.newBalance,
        restaurantId: transaction.restaurant.id,
        restaurantName: transaction.restaurant.name,
        transactionId: transaction.id,
        timestamp: transaction.createdAt.getTime(),
        description: transaction.description,
      });

      // Save to database for persistence
      // await this.saveNotification(...);
    } catch (error) {
      console.error('[EventHandler] Points added error:', error);
    }
  }

  /**
   * Handle points redeemed event
   */
  async onPointsRedeemed(transactionId: string): Promise<void> {
    try {
      const transaction = await this.transactionRepo.findOne({
        where: { id: transactionId },
        relations: ['guest', 'restaurant', 'reward'],
      });

      if (!transaction) return;

      this.wsServer.broadcastPointsRedeemed(transaction.restaurant.id, {
        guestId: transaction.guest.id,
        cardId: transaction.guest.cardId,
        amount: transaction.amount,
        newBalance: transaction.newBalance,
        restaurantId: transaction.restaurant.id,
        rewardName: transaction.reward?.name || 'Unknown Reward',
        transactionId: transaction.id,
        timestamp: transaction.createdAt.getTime(),
      });
    } catch (error) {
      console.error('[EventHandler] Points redeemed error:', error);
    }
  }

  /**
   * Broadcast new guest registration
   */
  async onGuestRegistered(guestId: string, restaurantId: string): Promise<void> {
    try {
      // Query guest data
      // const guest = await getGuest(guestId);

      this.wsServer.broadcastToAdmins('guest_registered', {
        guestId,
        // guestName: guest.name,
        // email: guest.email,
        restaurantId,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('[EventHandler] Guest registered error:', error);
    }
  }
}
```

---

## 🎯 WebSocket События

Полный список событий в отдельном документе:

**Client → Server:**
- `subscribe` - Подписка на канал
- `unsubscribe` - Отписка от канала
- `action_confirm` - Подтверждение действия

**Server → Client:**
- **System:** `connected`, `disconnected`, `error`
- **Points:** `points_added`, `points_redeemed`, `points_expired`
- **Cards:** `card_created`, `guest_card_updated`, `guest_registered`
- **Restaurant:** `restaurant_guest_joined`, `restaurant_status_changed`, `restaurant_transaction`
- **Admin:** `system_alert`, `admin_notification`

---

## 💡 Примеры Использования

### Example 1: Guest Page with Real-time Points

```typescript
// src/pages/guest/GuestCard.tsx

import { useEffect } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useGuestStore } from '@stores/guestStore';
import { useNotifications } from '@services/notificationService';

export function GuestCard() {
  const user = useAuthStore((state) => state.user);
  const { points, card } = useGuestStore();
  const { subscribe } = useNotifications();

  useEffect(() => {
    if (user?.id && card?.id) {
      // Subscribe to this guest's card updates
      subscribe('guest_card', {
        guestId: user.id,
        cardId: card.id,
      });
    }
  }, [user?.id, card?.id]);

  return (
    <div>
      <h1>My Loyalty Card</h1>
      <div className="text-4xl font-bold">{points} Points</div>
      <img src={card?.qrCode} alt="QR Code" />
    </div>
  );
}
```

### Example 2: Restaurant Dashboard with Real-time Transactions

```typescript
// src/pages/restaurant/RestaurantDashboard.tsx

import { useEffect, useState } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useNotifications } from '@services/notificationService';

export function RestaurantDashboard() {
  const user = useAuthStore((state) => state.user);
  const { subscribe, isConnected } = useNotifications();
  const [todayTransactions, setTodayTransactions] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    if (user?.restaurantId) {
      subscribe('points_operations', {
        restaurantId: user.restaurantId,
      });
    }
  }, [user?.restaurantId]);

  useEffect(() => {
    // Listen for real-time transactions
    const unsubscribe = websocketService.on('restaurant_transaction', (data) => {
      setTodayTransactions((prev) => [data, ...prev].slice(0, 20));
      setTodayRevenue((prev) => prev + data.amount);
    });

    return () => unsubscribe?.();
  }, []);

  return (
    <div>
      <h1>Restaurant Dashboard</h1>
      <div className="flex gap-4">
        <div className="card">
          <h3>Today's Revenue</h3>
          <p className="text-2xl">₽{todayRevenue}</p>
          {!isConnected && <p className="text-red-500">Offline</p>}
        </div>
        <div className="card">
          <h3>Transactions</h3>
          <ul>
            {todayTransactions.map((t) => (
              <li key={t.transactionId}>
                {t.guestName}: +{t.amount} points
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

## 🚀 Deployment & Масштабирование

### Multi-Server Architecture

Для масштабирования используйте Redis Adapter:

```typescript
// backend/src/websocket/websocketServer.ts

import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class WebSocketServer {
  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer);

    // Setup Redis adapter for horizontal scaling
    const pubClient = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      this.io.adapter(createAdapter(pubClient, subClient));
    });
  }
}
```

### Load Balancer Configuration (Nginx)

```nginx
upstream websocket {
  server ws-server-1:3000;
  server ws-server-2:3000;
  server ws-server-3:3000;
}

server {
  listen 80;
  server_name api.maxloyalty.com;

  location /socket.io {
    proxy_pass http://websocket;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 86400;
  }
}
```

---

## ✅ Implementation Checklist

### Frontend
- [ ] WebSocket Service (`websocketService.ts`)
- [ ] Notification Store (`notificationStore.ts`)
- [ ] Notification Hook (`useNotifications`)
- [ ] Toast Component (`ToastContainer.tsx`)
- [ ] Notification Center (`NotificationCenter.tsx`)
- [ ] Integrate in App.tsx
- [ ] Add to dashboard pages
- [ ] Testing

### Backend
- [ ] Socket.io server setup
- [ ] Authentication middleware
- [ ] Event handlers
- [ ] Room management
- [ ] Error handling
- [ ] Redis adapter for scaling
- [ ] API integrations
- [ ] Testing

### DevOps
- [ ] Docker setup
- [ ] Environment variables
- [ ] Redis configuration
- [ ] Load balancer setup
- [ ] Monitoring (Prometheus/Grafana)
- [ ] Logging (ELK stack)

---

**Статус:** Ready for Development 🚀
**Следующие шаги:** Реализация в backend и frontend параллельно
