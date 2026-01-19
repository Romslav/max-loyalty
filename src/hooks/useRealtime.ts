import { useEffect, useCallback } from 'react';
import { realtimeService } from '../services/realtimeService';

type EventHandler = (...args: any[]) => void;

/**
 * Hook to use real-time WebSocket events
 * Usage:
 *   const { on, off, emit } = useRealtime();
 *   useEffect(() => {
 *     const handler = (data) => console.log('Guest updated:', data);
 *     on('guests:updated', handler);
 *     return () => off('guests:updated', handler);
 *   }, [on, off]);
 */
export const useRealtime = () => {
  const isConnected = realtimeService.getIsConnected();

  const on = useCallback((event: string, handler: EventHandler) => {
    realtimeService.on(event, handler);
  }, []);

  const off = useCallback((event: string, handler: EventHandler) => {
    realtimeService.off(event, handler);
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    realtimeService.emit(event, data);
  }, []);

  return {
    on,
    off,
    emit,
    isConnected,
  };
};