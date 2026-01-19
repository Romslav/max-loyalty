import { io, Socket } from 'socket.io-client';
import { logger } from './loggerService';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
const RECONNECT_INTERVAL = parseInt(
  import.meta.env.VITE_WS_RECONNECT_INTERVAL || '5000'
);

type EventHandler = (...args: any[]) => void;

/**
 * Real-time service using Socket.IO for WebSocket communication
 */
class RealtimeService {
  private socket: Socket | null = null;
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private isConnected = false;

  /**
   * Initialize WebSocket connection
   */
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(WS_URL, {
          auth: token ? { token } : undefined,
          reconnection: true,
          reconnectionDelay: RECONNECT_INTERVAL,
          reconnectionDelayMax: 10000,
          reconnectionAttempts: 5,
        });

        // Connection events
        this.socket.on('connect', () => {
          this.isConnected = true;
          logger.info('WebSocket connected');
          resolve();
        });

        this.socket.on('disconnect', () => {
          this.isConnected = false;
          logger.warn('WebSocket disconnected');
        });

        this.socket.on('error', (error) => {
          logger.error('WebSocket error', error);
          reject(error);
        });
      } catch (error) {
        logger.error('Failed to connect WebSocket', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      logger.info('WebSocket disconnected');
    }
  }

  /**
   * Subscribe to an event
   */
  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    if (this.socket) {
      this.socket.on(event, handler);
    }

    logger.debug(`Subscribed to event: ${event}`);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, handler: EventHandler): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
    }

    if (this.socket) {
      this.socket.off(event, handler);
    }

    logger.debug(`Unsubscribed from event: ${event}`);
  }

  /**
   * Emit an event
   */
  emit(event: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      logger.debug(`Emitted event: ${event}`, data);
    } else {
      logger.warn(`Cannot emit event: ${event}, socket not connected`);
    }
  }

  /**
   * Check if WebSocket is connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const realtimeService = new RealtimeService();