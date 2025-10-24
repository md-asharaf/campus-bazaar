import { io, Socket } from "socket.io-client";
import { SocketConnectionState, MessageStatus, type SocketLoadingStates } from "@/types/chat";

// Event interfaces based on backend implementation
export interface ServerToClientEvents {
  connected: (data: { userId: string }) => void;
  joined_chat: (data: { chatId: string }) => void;
  left_chat: (data: { chatId: string }) => void;
  new_message: (data: { messageId: string; content: string; senderId: string; chatId: string, media?: string[] }) => void;
  message_delivered: (data: { messageId: string; deliveredTo: string }) => void;
  message_read: (data: { messageId: string; readBy: string }) => void;
  user_typing: (data: { userId: string; chatId: string }) => void;
  user_stopped_typing: (data: { userId: string; chatId: string }) => void;
  user_online: (data: { userId: string }) => void;
  user_offline: (data: { userId: string }) => void;
  error: (data: { message: string }) => void;
  connect: () => void;
  connect_error: (error: Error) => void;
  disconnect: (reason: string) => void;
}

// Re-export types for convenience
export { SocketConnectionState, MessageStatus };
export type { SocketLoadingStates };

export interface ClientToServerEvents {
  join_chat: (data: { chatId: string }) => void;
  leave_chat: (data: { chatId: string }) => void;
  send_message: (data: { chatId: string; content: string }) => void;
  mark_delivered: (data: { messageId: string }) => void;
  mark_read: (data: { messageId: string }) => void;
  typing_start: (data: { chatId: string }) => void;
  typing_stop: (data: { chatId: string }) => void;
}

class SocketService {
  private static instance: SocketService;
  public socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  
  // State management
  private connectionState: SocketConnectionState = SocketConnectionState.DISCONNECTED;
  private loadingStates: SocketLoadingStates = {
    connecting: false,
    sendingMessage: false,
    joiningChat: false,
    leavingChat: false
  };
  
  // Event listeners for state changes
  private stateListeners: Array<(state: SocketConnectionState) => void> = [];
  private loadingListeners: Array<(loading: SocketLoadingStates) => void> = [];
  private messageStatusListeners: Array<(messageId: string, status: MessageStatus) => void> = [];

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        console.log("Socket already connected");
        resolve();
        return;
      }

      this.setConnectionState(SocketConnectionState.CONNECTING);
      this.setLoadingState('connecting', true);

      if (this.socket) {
        this.socket.disconnect();
      }

      const serverUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      console.log("Connecting to socket server:", serverUrl);

      // Add retry logic for authentication failures
      let retryCount = 0;
      const maxRetries = 3;
      
      const attemptConnection = () => {
        this.socket = io(serverUrl, {
          withCredentials: true,
          transports: ["websocket", "polling"],
          timeout: 20000,
        });

        this.socket.on("connect", () => {
          console.log("Socket connected:", this.socket?.id);
          this.setConnectionState(SocketConnectionState.CONNECTED);
          this.setLoadingState('connecting', false);
          retryCount = 0; // Reset retry count on successful connection
          this.setupEventListeners();
          resolve();
        });

        this.socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error.message);
          
          // If authentication failed and we have retries left, wait and try again
          if (error.message === 'Authentication failed' && retryCount < maxRetries) {
            retryCount++;
            this.setConnectionState(SocketConnectionState.RECONNECTING);
            console.log(`Retrying socket connection (${retryCount}/${maxRetries})...`);
            
            // Disconnect current socket
            if (this.socket) {
              this.socket.disconnect();
            }
            
            // Wait 2 seconds before retry to allow authentication to complete
            setTimeout(() => {
              attemptConnection();
            }, 2000);
          } else {
            this.setConnectionState(SocketConnectionState.ERROR);
            this.setLoadingState('connecting', false);
            reject(error);
          }
        });

        this.socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
          this.setConnectionState(SocketConnectionState.DISCONNECTED);
          this.setLoadingState('connecting', false);
        });

        this.socket.on("error", (error) => {
          console.error("Socket error:", error);
          this.setConnectionState(SocketConnectionState.ERROR);
        });
      };

      attemptConnection();
    });
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Real-time message updates
    this.socket.on("new_message", (data) => {
      // Message successfully sent/received
      this.notifyMessageStatus(data.messageId, MessageStatus.SENT);
    });

    this.socket.on("message_delivered", (data) => {
      this.notifyMessageStatus(data.messageId, MessageStatus.DELIVERED);
    });

    this.socket.on("message_read", (data) => {
      this.notifyMessageStatus(data.messageId, MessageStatus.READ);
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log("Disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
    }
    this.setConnectionState(SocketConnectionState.DISCONNECTED);
    this.resetLoadingStates();
  }

  on<Event extends keyof ServerToClientEvents>(
    event: Event,
    listener: ServerToClientEvents[Event]
  ): void {
    if (this.socket) {
      this.socket.on(event, listener as any);
    }
  }

  off<Event extends keyof ServerToClientEvents>(
    event: Event,
    listener?: ServerToClientEvents[Event]
  ): void {
    if (this.socket) {
      if (listener) {
        this.socket.off(event, listener as any);
      } else {
        this.socket.removeAllListeners(event);
      }
    }
  }

  emit<Event extends keyof ClientToServerEvents>(
    event: Event,
    ...args: Parameters<ClientToServerEvents[Event]>
  ): void {
    if (this.socket?.connected) {
      this.socket.emit(event, ...args);
    } else {
      console.warn(`Cannot emit '${String(event)}': Socket not connected`);
    }
  }

  // Chat specific methods with loading states
  async joinChat(chatId: string): Promise<void> {
    return new Promise((resolve) => {
      this.setLoadingState('joiningChat', true);
      this.emit("join_chat", { chatId });
      
      // Listen for join confirmation
      const handleJoined = (data: { chatId: string }) => {
        if (data.chatId === chatId) {
          this.setLoadingState('joiningChat', false);
          this.off("joined_chat", handleJoined);
          resolve();
        }
      };
      
      this.on("joined_chat", handleJoined);
      
      // Timeout fallback
      setTimeout(() => {
        this.setLoadingState('joiningChat', false);
        this.off("joined_chat", handleJoined);
        resolve();
      }, 5000);
    });
  }

  async leaveChat(chatId: string): Promise<void> {
    return new Promise((resolve) => {
      this.setLoadingState('leavingChat', true);
      this.emit("leave_chat", { chatId });
      
      // Listen for leave confirmation
      const handleLeft = (data: { chatId: string }) => {
        if (data.chatId === chatId) {
          this.setLoadingState('leavingChat', false);
          this.off("left_chat", handleLeft);
          resolve();
        }
      };
      
      this.on("left_chat", handleLeft);
      
      // Timeout fallback
      setTimeout(() => {
        this.setLoadingState('leavingChat', false);
        this.off("left_chat", handleLeft);
        resolve();
      }, 5000);
    });
  }

  async sendMessage(chatId: string, content: string, tempMessageId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.setLoadingState('sendingMessage', true);
      
      if (tempMessageId) {
        this.notifyMessageStatus(tempMessageId, MessageStatus.SENDING);
      }

      this.emit("send_message", { chatId, content });

      // Listen for message confirmation
      const handleNewMessage = (data: { messageId: string; chatId: string }) => {
        if (data.chatId === chatId) {
          this.setLoadingState('sendingMessage', false);
          if (tempMessageId) {
            this.notifyMessageStatus(tempMessageId, MessageStatus.SENT);
          }
          this.off("new_message", handleNewMessage);
          resolve();
        }
      };

      this.on("new_message", handleNewMessage);

      // Timeout fallback
      setTimeout(() => {
        this.setLoadingState('sendingMessage', false);
        if (tempMessageId) {
          this.notifyMessageStatus(tempMessageId, MessageStatus.FAILED);
        }
        this.off("new_message", handleNewMessage);
        reject(new Error('Message send timeout'));
      }, 10000);
    });
  }

  markDelivered(messageId: string): void {
    this.emit("mark_delivered", { messageId });
  }

  markRead(messageId: string): void {
    this.emit("mark_read", { messageId });
  }

  typingStart(chatId: string): void {
    this.emit("typing_start", { chatId });
  }

  typingStop(chatId: string): void {
    this.emit("typing_stop", { chatId });
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Method to check if connection is ready for authenticated operations
  isAuthenticated(): boolean {
    return Boolean(this.socket?.connected && this.socket?.id);
  }

  // Graceful reconnection method
  reconnect(): Promise<void> {
    this.disconnect();
    return this.connect();
  }

  // State management methods
  private setConnectionState(state: SocketConnectionState): void {
    this.connectionState = state;
    this.stateListeners.forEach(listener => listener(state));
  }

  private setLoadingState(key: keyof SocketLoadingStates, value: boolean): void {
    this.loadingStates[key] = value;
    this.loadingListeners.forEach(listener => listener({ ...this.loadingStates }));
  }

  private resetLoadingStates(): void {
    this.loadingStates = {
      connecting: false,
      sendingMessage: false,
      joiningChat: false,
      leavingChat: false
    };
    this.loadingListeners.forEach(listener => listener({ ...this.loadingStates }));
  }

  private notifyMessageStatus(messageId: string, status: MessageStatus): void {
    this.messageStatusListeners.forEach(listener => listener(messageId, status));
  }

  // Public subscription methods
  onConnectionStateChange(listener: (state: SocketConnectionState) => void): () => void {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  onLoadingStateChange(listener: (loading: SocketLoadingStates) => void): () => void {
    this.loadingListeners.push(listener);
    return () => {
      this.loadingListeners = this.loadingListeners.filter(l => l !== listener);
    };
  }

  onMessageStatusChange(listener: (messageId: string, status: MessageStatus) => void): () => void {
    this.messageStatusListeners.push(listener);
    return () => {
      this.messageStatusListeners = this.messageStatusListeners.filter(l => l !== listener);
    };
  }

  // Getters for current state
  getConnectionState(): SocketConnectionState {
    return this.connectionState;
  }

  getLoadingStates(): SocketLoadingStates {
    return { ...this.loadingStates };
  }
}

export const socketService = SocketService.getInstance();