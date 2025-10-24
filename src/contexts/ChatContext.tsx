import { createContext, useReducer, useEffect, type ReactNode } from 'react';
import { socketService, SocketConnectionState, MessageStatus } from '@/services/socket.service';
import { chatService } from '@/services/chat.service';
import type { Message, Chat, User } from '@/types';

// Message with loading state
export interface MessageWithState extends Message {
  tempId?: string;
  status?: MessageStatus;
  isOptimistic?: boolean;
}

// Chat state interface
interface ChatState {
  // Connection state
  connectionState: SocketConnectionState;
  isConnected: boolean;
  
  // Current chat
  currentChat: Chat | null;
  otherUser: User | null;
  
  // Messages
  messages: MessageWithState[];
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

// Action types
type ChatAction =
  | { type: 'SET_CONNECTION_STATE'; payload: SocketConnectionState }
  | { type: 'SET_CURRENT_CHAT'; payload: { chat: Chat | null; otherUser: User | null } }
  | { type: 'SET_MESSAGES'; payload: MessageWithState[] }
  | { type: 'ADD_MESSAGE'; payload: MessageWithState }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<MessageWithState> } }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { messageId: string; status: MessageStatus } }
  | { type: 'SET_MESSAGES_LOADING'; payload: boolean }
  | { type: 'SET_HAS_MORE_MESSAGES'; payload: boolean }
  | { type: 'SET_LOADING_STATE'; payload: { key: keyof ChatState['loadingStates']; value: boolean } }
  | { type: 'ADD_TYPING_USER'; payload: { userId: string; chatId: string } }
  | { type: 'REMOVE_TYPING_USER'; payload: { userId: string; chatId: string } }
  | { type: 'ADD_ONLINE_USER'; payload: string }
  | { type: 'REMOVE_ONLINE_USER'; payload: string }
  | { type: 'SET_MESSAGE_INPUT'; payload: string }
  | { type: 'SET_SELECTED_IMAGES'; payload: { images: File[]; previews: string[] } }
  | { type: 'CLEAR_SELECTED_IMAGES' }
  | { type: 'RESET_CHAT' };

// Initial state
const initialState: ChatState = {
  connectionState: SocketConnectionState.DISCONNECTED,
  isConnected: false,
  currentChat: null,
  otherUser: null,
  messages: [],
  messagesLoading: false,
  hasMoreMessages: true,
  loadingStates: {
    sendingMessage: false,
    joiningChat: false,
    leavingChat: false,
    loadingMessages: false,
    loadingChats: false,
  },
  typingUsers: new Set(),
  onlineUsers: new Set(),
  messageInputValue: '',
  selectedImages: [],
  imagePreviews: [],
};

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONNECTION_STATE':
      return {
        ...state,
        connectionState: action.payload,
        isConnected: action.payload === SocketConnectionState.CONNECTED,
      };

    case 'SET_CURRENT_CHAT':
      return {
        ...state,
        currentChat: action.payload.chat,
        otherUser: action.payload.otherUser,
        messages: [], // Clear messages when switching chats
        typingUsers: new Set(),
      };

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload.sort((a, b) => 
          new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        ),
      };

    case 'ADD_MESSAGE': {
      // Only add message if it belongs to current chat
      if (!state.currentChat || action.payload.chatId !== state.currentChat.id) {
        return state;
      }

      const existingIndex = state.messages.findIndex(
        m => m.id === action.payload.id || m.tempId === action.payload.tempId
      );
      
      if (existingIndex !== -1) {
        // Update existing message (e.g., optimistic -> real)
        const updatedMessages = [...state.messages];
        updatedMessages[existingIndex] = {
          ...updatedMessages[existingIndex],
          ...action.payload,
        };
        return {
          ...state,
          messages: updatedMessages,
        };
      } else {
        // Add new message
        return {
          ...state,
          messages: [...state.messages, action.payload],
        };
      }
    }

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.id
            ? { ...message, ...action.payload.updates }
            : message
        ),
      };

    case 'UPDATE_MESSAGE_STATUS':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId || message.tempId === action.payload.messageId
            ? { ...message, status: action.payload.status }
            : message
        ),
      };

    case 'SET_MESSAGES_LOADING':
      return {
        ...state,
        messagesLoading: action.payload,
      };

    case 'SET_HAS_MORE_MESSAGES':
      return {
        ...state,
        hasMoreMessages: action.payload,
      };

    case 'SET_LOADING_STATE':
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'ADD_TYPING_USER': {
      // Only add typing user if it belongs to current chat and is not the current user
      if (!state.currentChat || action.payload.chatId !== state.currentChat.id || action.payload.userId === state.otherUser?.id) {
        return state;
      }
      const newTypingUsers = new Set(state.typingUsers);
      newTypingUsers.add(action.payload.userId);
      return {
        ...state,
        typingUsers: newTypingUsers,
      };
    }

    case 'REMOVE_TYPING_USER': {
      // Only remove typing user if it belongs to current chat
      if (!state.currentChat || action.payload.chatId !== state.currentChat.id) {
        return state;
      }
      const updatedTypingUsers = new Set(state.typingUsers);
      updatedTypingUsers.delete(action.payload.userId);
      return {
        ...state,
        typingUsers: updatedTypingUsers,
      };
    }

    case 'ADD_ONLINE_USER': {
      const newOnlineUsers = new Set(state.onlineUsers);
      newOnlineUsers.add(action.payload);
      return {
        ...state,
        onlineUsers: newOnlineUsers,
      };
    }

    case 'REMOVE_ONLINE_USER': {
      const updatedOnlineUsers = new Set(state.onlineUsers);
      updatedOnlineUsers.delete(action.payload);
      return {
        ...state,
        onlineUsers: updatedOnlineUsers,
      };
    }

    case 'SET_MESSAGE_INPUT':
      return {
        ...state,
        messageInputValue: action.payload,
      };

    case 'SET_SELECTED_IMAGES':
      return {
        ...state,
        selectedImages: action.payload.images,
        imagePreviews: action.payload.previews,
      };

    case 'CLEAR_SELECTED_IMAGES':
      return {
        ...state,
        selectedImages: [],
        imagePreviews: [],
      };

    case 'RESET_CHAT':
      return {
        ...initialState,
        connectionState: state.connectionState,
        isConnected: state.isConnected,
      };

    default:
      return state;
  }
}

// Context
interface ChatContextType {
  state: ChatState;
  
  // Chat actions
  setCurrentChat: (chat: Chat | null, otherUser: User | null) => void;
  
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

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Socket event listeners
  useEffect(() => {
    // Connection state changes
    const unsubscribeConnection = socketService.onConnectionStateChange((connectionState) => {
      dispatch({ type: 'SET_CONNECTION_STATE', payload: connectionState });
    });

    // Loading state changes
    const unsubscribeLoading = socketService.onLoadingStateChange((loadingStates) => {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'sendingMessage', value: loadingStates.sendingMessage } });
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'joiningChat', value: loadingStates.joiningChat } });
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'leavingChat', value: loadingStates.leavingChat } });
    });

    // Message status changes
    const unsubscribeMessageStatus = socketService.onMessageStatusChange((messageId, status) => {
      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { messageId, status } });
    });

    // Real-time message events
    socketService.on('new_message', (data) => {
      dispatch({ type: 'ADD_MESSAGE', payload: {
        id: data.messageId,
        content: data.content,
        senderId: data.senderId,
        chatId: data.chatId,
        sentAt: new Date().toISOString(),
        media: data.media || [],
        status: MessageStatus.SENT,
      }});
    });

    // Typing events
    socketService.on('user_typing', (data) => {
      dispatch({ type: 'ADD_TYPING_USER', payload: { userId: data.userId, chatId: data.chatId } });
    });

    socketService.on('user_stopped_typing', (data) => {
      dispatch({ type: 'REMOVE_TYPING_USER', payload: { userId: data.userId, chatId: data.chatId } });
    });

    // Online status events
    socketService.on('user_online', (data) => {
      dispatch({ type: 'ADD_ONLINE_USER', payload: data.userId });
    });

    socketService.on('user_offline', (data) => {
      dispatch({ type: 'REMOVE_ONLINE_USER', payload: data.userId });
    });

    // Message delivery events
    socketService.on('message_delivered', (data) => {
      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { messageId: data.messageId, status: MessageStatus.DELIVERED } });
    });

    socketService.on('message_read', (data) => {
      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { messageId: data.messageId, status: MessageStatus.READ } });
    });

    return () => {
      unsubscribeConnection();
      unsubscribeLoading();
      unsubscribeMessageStatus();
      socketService.off('new_message');
      socketService.off('user_typing');
      socketService.off('user_stopped_typing');
      socketService.off('user_online');
      socketService.off('user_offline');
      socketService.off('message_delivered');
      socketService.off('message_read');
    };
  }, []);

  // Actions
  const setCurrentChat = (chat: Chat | null, otherUser: User | null) => {
    dispatch({ type: 'SET_CURRENT_CHAT', payload: { chat, otherUser } });
    
    if (chat) {
      socketService.joinChat(chat.id);
    }
  };

  const addOptimisticMessage = (content: string, tempId: string) => {
    if (!state.currentChat || !state.otherUser) return;

    const optimisticMessage: MessageWithState = {
      id: tempId,
      tempId,
      content,
      senderId: '', // Will be filled by the current user ID
      chatId: state.currentChat.id,
      sentAt: new Date().toISOString(),
      media: [],
      status: MessageStatus.SENDING,
      isOptimistic: true,
    };

    dispatch({ type: 'ADD_MESSAGE', payload: optimisticMessage });
  };

  const sendMessage = async (content: string, images?: File[]) => {
    if (!state.currentChat) return;

    const tempId = `temp_${Date.now()}_${Math.random()}`;
    
    try {
      if (images && images.length > 0) {
        // Handle image messages separately via HTTP
        await chatService.sendImageMessage(state.currentChat.id, content, images);
      } else {
        // Send text message via socket
        addOptimisticMessage(content, tempId);
        await socketService.sendMessage(state.currentChat.id, content, tempId);
      }
      
      // Clear input after successful send
      dispatch({ type: 'SET_MESSAGE_INPUT', payload: '' });
      dispatch({ type: 'CLEAR_SELECTED_IMAGES' });
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: { messageId: tempId, status: MessageStatus.FAILED } });
    }
  };

  const loadMessages = async (chatId: string, page = 1) => {
    dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'loadingMessages', value: true } });
    
    try {
      const response = await chatService.getMessages(chatId, page, 50);
      
      if (response.success) {
        const messages = response.data.map((msg: Message) => ({
          ...msg,
          status: MessageStatus.DELIVERED, // Default status for loaded messages
        }));
        
        if (page === 1) {
          dispatch({ type: 'SET_MESSAGES', payload: messages });
        } else {
          // Append to existing messages for pagination
          dispatch({ type: 'SET_MESSAGES', payload: [...messages, ...state.messages] });
        }
        
        dispatch({ type: 'SET_HAS_MORE_MESSAGES', payload: messages.length === 50 });
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'loadingMessages', value: false } });
    }
  };

  const startTyping = () => {
    if (state.currentChat) {
      socketService.typingStart(state.currentChat.id);
    }
  };

  const stopTyping = () => {
    if (state.currentChat) {
      socketService.typingStop(state.currentChat.id);
    }
  };

  const markMessageAsRead = (messageId: string) => {
    socketService.markRead(messageId);
  };

  const setMessageInput = (value: string) => {
    dispatch({ type: 'SET_MESSAGE_INPUT', payload: value });
  };

  const setSelectedImages = (images: File[], previews: string[]) => {
    dispatch({ type: 'SET_SELECTED_IMAGES', payload: { images, previews } });
  };

  const clearSelectedImages = () => {
    dispatch({ type: 'CLEAR_SELECTED_IMAGES' });
  };

  const resetChat = () => {
    dispatch({ type: 'RESET_CHAT' });
  };

  const contextValue: ChatContextType = {
    state,
    setCurrentChat,
    sendMessage,
    addOptimisticMessage,
    loadMessages,
    startTyping,
    stopTyping,
    markMessageAsRead,
    setMessageInput,
    setSelectedImages,
    clearSelectedImages,
    resetChat,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

