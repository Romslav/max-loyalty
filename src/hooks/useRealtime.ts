import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseRealtimeOptions {
  url?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  reconnectionAttempts?: number;
}

const DEFAULT_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const useRealtime = (options: UseRealtimeOptions = {}) => {
  const {
    url = DEFAULT_URL,
    autoConnect = true,
    reconnection = true,
    reconnectionDelay = 1000,
    reconnectionDelayMax = 5000,
    reconnectionAttempts = 5,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Map<string, Set<Function>>>(new Map());

  /**
   * Инициализировать Socket.IO соединение
   */
  useEffect(() => {
    if (socketRef.current?.connected) return;

    const socket = io(url, {
      autoConnect,
      reconnection,
      reconnectionDelay,
      reconnectionDelayMax,
      reconnectionAttempts,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('[Socket.IO] Connected:', socket.id);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('[Socket.IO] Disconnected:', reason);
    });

    socket.on('connect_error', (error: Error) => {
      console.error('[Socket.IO] Connection error:', error);
    });

    socket.on('reconnect_attempt', () => {
      console.log('[Socket.IO] Reconnecting...');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url, autoConnect, reconnection, reconnectionDelay, reconnectionDelayMax, reconnectionAttempts]);

  /**
   * Подписаться на событие
   */
  const on = useCallback((event: string, callback: Function) => {
    if (!socketRef.current) return;

    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }

    listenersRef.current.get(event)!.add(callback);

    socketRef.current.on(event, callback as any);

    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback as any);
        listenersRef.current.get(event)?.delete(callback);
      }
    };
  }, []);

  /**
   * Отподписаться от события
   */
  const off = useCallback((event: string, callback?: Function) => {
    if (!socketRef.current) return;

    if (callback) {
      socketRef.current.off(event, callback as any);
      listenersRef.current.get(event)?.delete(callback);
    } else {
      socketRef.current.off(event);
      listenersRef.current.delete(event);
    }
  }, []);

  /**
   * Отпослать событие
   */
  const emit = useCallback(
    (event: string, data?: any, callback?: (response: any) => void) => {
      if (!socketRef.current?.connected) {
        console.warn('[Socket.IO] Not connected, cannot emit event:', event);
        return;
      }
      socketRef.current.emit(event, data, callback);
    },
    []
  );

  /**
   * Отпослать событие и ожидать ответ
   */
  const emitWithResponse = useCallback(
    (event: string, data?: any, timeout: number = 5000): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!socketRef.current?.connected) {
          reject(new Error('[Socket.IO] Not connected'));
          return;
        }

        const timer = setTimeout(() => {
          reject(new Error('[Socket.IO] Request timeout'));
        }, timeout);

        socketRef.current!.emit(event, data, (response: any) => {
          clearTimeout(timer);
          if (response?.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        });
      });
    },
    []
  );

  /**
   * Подписаться одно раз на событие
   */
  const once = useCallback((event: string, callback: Function) => {
    if (!socketRef.current) return;
    socketRef.current.once(event, callback as any);
  }, []);

  /**
   * Присоединиться к комнате
   */
  const joinRoom = useCallback((room: string) => {
    if (!socketRef.current?.connected) {
      console.warn('[Socket.IO] Not connected, cannot join room:', room);
      return;
    }
    socketRef.current.emit('join_room', { room });
  }, []);

  /**
   * Опустить комнату
   */
  const leaveRoom = useCallback((room: string) => {
    if (!socketRef.current?.connected) {
      console.warn('[Socket.IO] Not connected, cannot leave room:', room);
      return;
    }
    socketRef.current.emit('leave_room', { room });
  }, []);

  /**
   * Проверить статус соединения
   */
  const isConnected = useCallback((): boolean => {
    return socketRef.current?.connected || false;
  }, []);

  /**
   * Получить Socket.IO socket непосредственно
   */
  const getSocket = useCallback((): Socket | null => {
    return socketRef.current;
  }, []);

  /**
   * Получить ID сокета
   */
  const getSocketId = useCallback((): string | undefined => {
    return socketRef.current?.id;
  }, []);

  /**
   * Принудительно переподключиться
   */
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
  }, []);

  /**
   * Отключиться
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  return {
    on,
    off,
    once,
    emit,
    emitWithResponse,
    joinRoom,
    leaveRoom,
    isConnected,
    getSocket,
    getSocketId,
    reconnect,
    disconnect,
  };
};
