import { TranslationMessage, WebSocketMessage } from '../types';

export type WebSocketEventCallback = (message: TranslationMessage) => void;
export type WebSocketErrorCallback = (error: string) => void;

class WebSocketService {
  private eventCallbacks: Map<string, WebSocketEventCallback[]> = new Map();
  private errorCallbacks: WebSocketErrorCallback[] = [];
  private activeEvents: Set<string> = new Set();

  // Mock WebSocket - in production, you'd use a real WebSocket server
  private simulateWebSocket = true;

  createEvent(eventCode: string): void {
    this.activeEvents.add(eventCode);
    console.log(`Event ${eventCode} created`);
  }

  joinEvent(eventCode: string): boolean {
    if (this.activeEvents.has(eventCode)) {
      console.log(`Joined event ${eventCode}`);
      return true;
    } else {
      this.notifyError(`Event ${eventCode} not found`);
      return false;
    }
  }

  sendTranslation(eventCode: string, message: TranslationMessage): void {
    if (!this.activeEvents.has(eventCode)) {
      this.notifyError(`Event ${eventCode} not active`);
      return;
    }

    // Simulate network delay
    setTimeout(() => {
      this.notifyEventListeners(eventCode, message);
    }, 100);
  }

  onTranslation(eventCode: string, callback: WebSocketEventCallback): () => void {
    if (!this.eventCallbacks.has(eventCode)) {
      this.eventCallbacks.set(eventCode, []);
    }
    
    this.eventCallbacks.get(eventCode)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.eventCallbacks.get(eventCode);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  onError(callback: WebSocketErrorCallback): () => void {
    this.errorCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  leaveEvent(eventCode: string): void {
    console.log(`Left event ${eventCode}`);
    // Clean up callbacks for this event
    this.eventCallbacks.delete(eventCode);
  }

  closeEvent(eventCode: string): void {
    this.activeEvents.delete(eventCode);
    this.eventCallbacks.delete(eventCode);
    console.log(`Event ${eventCode} closed`);
  }

  private notifyEventListeners(eventCode: string, message: TranslationMessage): void {
    const callbacks = this.eventCallbacks.get(eventCode);
    if (callbacks) {
      callbacks.forEach(callback => callback(message));
    }
  }

  private notifyError(error: string): void {
    this.errorCallbacks.forEach(callback => callback(error));
  }

  // Check if event exists (useful for validation)
  eventExists(eventCode: string): boolean {
    return this.activeEvents.has(eventCode);
  }

  // Get active events count (for debugging)
  getActiveEventsCount(): number {
    return this.activeEvents.size;
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();

/* 
In production, you would implement a real WebSocket service like this:

import io from 'socket.io-client';

class RealWebSocketService {
  private socket: any;
  private eventCallbacks: Map<string, WebSocketEventCallback[]> = new Map();

  constructor() {
    this.socket = io('ws://your-websocket-server.com');
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on('translation', (data: any) => {
      this.notifyEventListeners(data.eventCode, data.message);
    });

    this.socket.on('error', (error: string) => {
      this.notifyError(error);
    });
  }

  createEvent(eventCode: string): void {
    this.socket.emit('create-event', { eventCode });
  }

  joinEvent(eventCode: string): void {
    this.socket.emit('join-event', { eventCode });
  }

  sendTranslation(eventCode: string, message: TranslationMessage): void {
    this.socket.emit('translation', { eventCode, message });
  }

  // ... rest of the methods would interact with real WebSocket
}
*/