// Message status enum
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

// Socket connection states
export enum SocketConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

// Loading states interface
export interface SocketLoadingStates {
  connecting: boolean;
  sendingMessage: boolean;
  joiningChat: boolean;
  leavingChat: boolean;
}

// Extended message with status
export interface MessageWithStatus {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  sentAt: string;
  deliveredAt?: string | null;
  readAt?: string | null;
  media?: string[];
  status?: MessageStatus;
  tempId?: string;
  isOptimistic?: boolean;
}

// Chat state for context
export interface ChatState {
  // Connection state
  connectionState: SocketConnectionState;
  isConnected: boolean;
  
  // Current chat
  currentChat: any | null;
  otherUser: any | null;
  
  // Messages
  messages: MessageWithStatus[];
  messagesLoading: boolean;
  hasMoreMessages: boolean;
  
  // Loading states
  loadingStates: {
    sendingMessage: boolean;
    joiningChat: boolean;
    leavingChat: boolean;
    loadingMessages: boolean;
    loadingChats: boolean;
  };
  
  // Real-time state
  typingUsers: Set<string>;
  onlineUsers: Set<string>;
  
  // UI state
  messageInputValue: string;
  selectedImages: File[];
  imagePreviews: string[];
}

// Chat actions
export type ChatAction =
  | { type: 'SET_CONNECTION_STATE'; payload: SocketConnectionState }
  | { type: 'SET_CURRENT_CHAT'; payload: { chat: any | null; otherUser: any | null } }
  | { type: 'SET_MESSAGES'; payload: MessageWithStatus[] }
  | { type: 'ADD_MESSAGE'; payload: MessageWithStatus }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<MessageWithStatus> } }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { messageId: string; status: MessageStatus } }
  | { type: 'SET_MESSAGES_LOADING'; payload: boolean }
  | { type: 'SET_HAS_MORE_MESSAGES'; payload: boolean }
  | { type: 'SET_LOADING_STATE'; payload: { key: keyof ChatState['loadingStates']; value: boolean } }
  | { type: 'ADD_TYPING_USER'; payload: string }
  | { type: 'REMOVE_TYPING_USER'; payload: string }
  | { type: 'ADD_ONLINE_USER'; payload: string }
  | { type: 'REMOVE_ONLINE_USER'; payload: string }
  | { type: 'SET_MESSAGE_INPUT'; payload: string }
  | { type: 'SET_SELECTED_IMAGES'; payload: { images: File[]; previews: string[] } }
  | { type: 'CLEAR_SELECTED_IMAGES' }
  | { type: 'RESET_CHAT' };

// Chat context type
export interface ChatContextType {
  state: ChatState;
  
  // Chat actions
  setCurrentChat: (chat: any | null, otherUser: any | null) => void;
  
  // Message actions
  sendMessage: (content: string, images?: File[]) => Promise<void>;
  addOptimisticMessage: (content: string, tempId: string) => void;
  loadMessages: (chatId: string, page?: number) => Promise<void>;
  
  // Real-time actions
  startTyping: () => void;
  stopTyping: () => void;
  markMessageAsRead: (messageId: string) => void;
  
  // UI actions
  setMessageInput: (value: string) => void;
  setSelectedImages: (images: File[], previews: string[]) => void;
  clearSelectedImages: () => void;
  
  // Utility
  resetChat: () => void;
}