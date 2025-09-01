import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  async initialize() {
    const serverUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    
    console.log('Connecting to server:', serverUrl);
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 10
    });

    return new Promise((resolve, reject) => {
      // Set up connection event handlers
      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
        this.connected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.connected = false;
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.connected = false;
        
        // Attempt to reconnect if disconnection wasn't intentional
        if (reason === 'io server disconnect') {
          this.socket.connect();
        }
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        this.connected = true;
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('Socket reconnection failed:', error);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed after maximum attempts');
        this.connected = false;
      });

      // Timeout for initial connection
      setTimeout(() => {
        if (!this.connected) {
          reject(new Error('Socket connection timeout'));
        }
      }, 10000);
    });
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    } else {
      console.warn('Socket not initialized. Call initialize() first.');
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
          this.listeners.delete(event);
        }
      }
    }
  }

  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
      console.log(`Emitted event: ${event}`, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  disconnect() {
    if (this.socket) {
      // Clean up all listeners
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      this.listeners.clear();
      
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('Socket disconnected and cleaned up');
    }
  }

  isConnected() {
    return this.connected;
  }

  // Convenience methods for common operations
  startSimulation() {
    this.emit('start_simulation');
  }

  stopSimulation() {
    this.emit('stop_simulation');
  }

  triggerEmergency(scenario) {
    this.emit('trigger_emergency', { scenario });
  }

  clearAlert(alertId) {
    this.emit('clear_alert', { alertId });
  }

  requestDeviceData(deviceId) {
    this.emit('request_device_data', { deviceId });
  }

  requestEdgeNodeData(nodeId) {
    this.emit('request_edge_node_data', { nodeId });
  }
}

// Export singleton instance
const socketService = new SocketService();
export { socketService as SocketService };
export default socketService;
