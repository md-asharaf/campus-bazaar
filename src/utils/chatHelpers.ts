import type { Conversation, Message, User } from "@/types";

/**
 * Safely get user initials from name
 */
export const getUserInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return '??';
  
  return name
    .trim()
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';
};

/**
 * Format time for chat messages with smart relative formatting
 */
export const formatChatTime = (dateString?: string | null): string => {
  if (!dateString) return '';
  
  try {
    const now = new Date();
    const messageDate = new Date(dateString);
    
    if (isNaN(messageDate.getTime())) {
      return '';
    }
    
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    // Less than 1 minute
    if (diffInMinutes < 1) {
      return 'now';
    }
    
    // Less than 1 hour
    if (diffInHours < 1) {
      return `${diffInMinutes}m`;
    }
    
    // Less than 24 hours
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    
    // Less than 7 days
    if (diffInDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // More than 7 days
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    
  } catch (error) {
    console.warn('Error formatting chat time:', error);
    return '';
  }
};

/**
 * Truncate message content with smart truncation
 */
export const truncateMessage = (text?: string | null, maxLength: number = 50): string => {
  if (!text || typeof text !== 'string') return '';
  
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  
  // Try to truncate at word boundary
  const truncated = trimmed.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.7) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

/**
 * Get display name for a user with fallback
 */
export const getDisplayName = (user?: User | null): string => {
  if (!user) return 'Unknown User';
  return user.name || 'Unknown User';
};

/**
 * Get avatar URL with fallback
 */
export const getAvatarUrl = (user?: User | null): string | undefined => {
  if (!user?.avatar) return undefined;
  return user.avatar;
};

/**
 * Check if a conversation has unread messages
 */
export const hasUnreadMessages = (conversation?: Conversation | null): boolean => {
  return (conversation?.unreadCount || 0) > 0;
};

/**
 * Get unread count with proper formatting (99+ for large numbers)
 */
export const getUnreadCountDisplay = (count?: number | null): string => {
  const unreadCount = count || 0;
  if (unreadCount === 0) return '';
  if (unreadCount > 99) return '99+';
  return unreadCount.toString();
};

/**
 * Get the latest message preview
 */
export const getMessagePreview = (message?: Message | null): string => {
  if (!message?.content) return 'Start a conversation...';
  return truncateMessage(message.content, 50);
};

/**
 * Check if user is online (placeholder - implement based on your online status logic)
 */
export const isUserOnline = (_user?: User | null): boolean => {
  // Placeholder implementation - replace with actual online status check
  return Math.random() > 0.5;
};

/**
 * Sort conversations by latest message time
 */
export const sortConversationsByLatestMessage = (conversations: Conversation[]): Conversation[] => {
  return [...conversations].sort((a, b) => {
    const timeA = a.latestMessage?.sentAt || a.createdAt;
    const timeB = b.latestMessage?.sentAt || b.createdAt;
    
    if (!timeA && !timeB) return 0;
    if (!timeA) return 1;
    if (!timeB) return -1;
    
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });
};

/**
 * Filter conversations based on search query
 */
export const filterConversations = (
  conversations: Conversation[], 
  searchQuery: string
): Conversation[] => {
  if (!searchQuery.trim()) return conversations;
  
  const query = searchQuery.toLowerCase().trim();
  
  return conversations.filter(conversation => {
    const userName = getDisplayName(conversation.otherUser).toLowerCase();
    const messageContent = (conversation.latestMessage?.content || '').toLowerCase();
    
    return userName.includes(query) || messageContent.includes(query);
  });
};

/**
 * Validate conversation data structure
 */
export const isValidConversation = (conversation: any): conversation is Conversation => {
  return (
    conversation &&
    typeof conversation === 'object' &&
    typeof conversation.id === 'string' &&
    conversation.otherUser &&
    typeof conversation.otherUser === 'object' &&
    typeof conversation.otherUser.id === 'string'
  );
};

/**
 * Get conversation display data for UI
 */
export const getConversationDisplayData = (conversation: Conversation) => {
  return {
    id: conversation.id,
    displayName: getDisplayName(conversation.otherUser),
    avatarUrl: getAvatarUrl(conversation.otherUser),
    initials: getUserInitials(conversation.otherUser?.name),
    messagePreview: getMessagePreview(conversation.latestMessage),
    timeDisplay: formatChatTime(conversation.latestMessage?.sentAt || conversation.createdAt),
    unreadCount: conversation.unreadCount || 0,
    unreadDisplay: getUnreadCountDisplay(conversation.unreadCount),
    hasUnread: hasUnreadMessages(conversation),
    isOnline: isUserOnline(conversation.otherUser),
  };
};