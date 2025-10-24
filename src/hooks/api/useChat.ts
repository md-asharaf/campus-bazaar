import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { chatService } from '@/services/chat.service';
import { createQueryFn, createMutationFn, handleApiError } from '@/utils/apiHelpers';
import { queryKeys } from './queryKeys';
import type { Chat, Message, Conversation } from '@/types';
import { useAuth } from '../useAuth';

// Types
type CreateChatData = {
  userId: string;
};

type SendImageMessageData = {
  chatId: string;
  content: string;
  images: File[];
};

type ChatsResponse = {
  chats: Chat[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type MessagesResponse = {
  messages: Message[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// Get My Chats Hook
export const useMyChats = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.chat.myChats(),
    queryFn: createQueryFn<ChatsResponse>(() => chatService.getMyChats(page, limit)),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Conversations Hook (alias for My Chats with different data structure)
export const useConversations = () => {
  const { user: currentUser } = useAuth();
  const { data, ...rest } = useMyChats();
  
  // Transform chats into conversation format if needed
  const conversations: Conversation[] = data?.chats?.map(chat => {
    const otherUser = chat.user1?.id === currentUser?.id ? chat.user2 : chat.user1;

    // Sort messages to find the latest one, as it's not guaranteed to be the first.
    const latestMessage = chat.messages?.length
      ? [...chat.messages].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0]
      : undefined;

    return {
      id: chat.id,
      otherUser: otherUser!,
      latestMessage: latestMessage || {} as Message, // Keep fallback for chats with no messages
      unreadCount: 0, // Would need to be calculated based on read status
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }) || [];

  return {
    data: conversations,
    conversations,
    ...rest,
  };
};

// Get Chat Messages Hook with Infinite Scroll
export const useChatMessages = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: queryKeys.chat.messages(chatId),
    queryFn: ({ pageParam = 1 }) => {
      return createQueryFn<MessagesResponse>(() => 
        chatService.getMessages(chatId, pageParam, 20)
      )();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.hasPrev) {
        return firstPage.page - 1;
      }
      return undefined;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!chatId,
  });
};

// Create or Get Chat Hook
export const useCreateOrGetChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Chat, CreateChatData>(
      (data) => chatService.createOrGetChat(data.userId)
    ),
    onSuccess: (data) => {
      // Invalidate chats list to include the new/existing chat
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.myChats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() });
      
      // Cache the new chat
      queryClient.setQueryData(
        queryKeys.chat.messages(data.id),
        {
          pages: [],
          pageParams: [],
        }
      );
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to create chat: ${message}`);
    },
  });
};

// Send Image Message Hook
export const useSendImageMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Message, SendImageMessageData>(
      (data) => chatService.sendImageMessage(data.chatId, data.content, data.images)
    ),
    onSuccess: (data, variables) => {
      // Add the new message to the messages cache
      queryClient.setQueryData(
        queryKeys.chat.messages(variables.chatId),
        (oldData: any) => {
          if (!oldData) {
            return {
              pages: [{
                messages: [data],
                total: 1,
                page: 1,
                totalPages: 1,
                hasNext: false,
                hasPrev: false,
              }],
              pageParams: [1],
            };
          }

          // Add to the first page (most recent messages)
          const updatedPages = [...oldData.pages];
          if (updatedPages[0]) {
            updatedPages[0] = {
              ...updatedPages[0],
              messages: [data, ...updatedPages[0].messages],
            };
          }

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );

      // Invalidate chats list to update latest message
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.myChats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() });
      
      toast.success('Message sent!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to send message: ${message}`);
    },
  });
};

// Hook to get flat list of all messages for a chat
export const useFlatChatMessages = (chatId: string) => {
  const { data, ...rest } = useChatMessages(chatId);
  
  const messages = data?.pages?.flatMap(page => page.messages) || [];
  
  return {
    messages,
    data,
    ...rest,
  };
};

// Hook to mark messages as read (mock implementation - would need backend support)
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, messageIds }: { chatId: string; messageIds: string[] }) => {
      // This would call an actual API endpoint
      return { success: true, chatId, messageIds };
    },
    onSuccess: (data) => {
      // Update messages in cache to mark as read
      queryClient.setQueryData(
        queryKeys.chat.messages(data.chatId),
        (oldData: any) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((message: Message) => 
              data.messageIds.includes(message.id)
                ? { ...message, readAt: new Date().toISOString() }
                : message
            ),
          }));

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );

      // Update conversations to reflect read status
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() });
    },
  });
};

// Hook to get unread message count
export const useUnreadMessageCount = () => {
  const { data: conversations } = useConversations();
  
  const totalUnread = conversations?.reduce((total, conv) => total + conv.unreadCount, 0) || 0;
  
  return {
    totalUnread,
    hasUnread: totalUnread > 0,
  };
};

// Hook for optimistic message updates
export const useOptimisticMessage = () => {
  const queryClient = useQueryClient();
  
  const addOptimisticMessage = (chatId: string, tempMessage: Partial<Message>) => {
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: tempMessage.content || '',
      senderId: 'currentUserId', // Would need to get from auth context
      chatId,
      sentAt: new Date().toISOString(),
      deliveredAt: null,
      readAt: null,
      media: tempMessage.media || [],
      ...tempMessage,
    };

    queryClient.setQueryData(
      queryKeys.chat.messages(chatId),
      (oldData: any) => {
        if (!oldData) {
          return {
            pages: [{
              messages: [optimisticMessage],
              total: 1,
              page: 1,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            }],
            pageParams: [1],
          };
        }

        const updatedPages = [...oldData.pages];
        if (updatedPages[0]) {
          updatedPages[0] = {
            ...updatedPages[0],
            messages: [optimisticMessage, ...updatedPages[0].messages],
          };
        }

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );

    return optimisticMessage.id;
  };

  const removeOptimisticMessage = (chatId: string, tempMessageId: string) => {
    queryClient.setQueryData(
      queryKeys.chat.messages(chatId),
      (oldData: any) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          messages: page.messages.filter((msg: Message) => msg.id !== tempMessageId),
        }));

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );
  };

  return { addOptimisticMessage, removeOptimisticMessage };
};

// Hook to prefetch chat data
export const usePrefetchChat = () => {
  const queryClient = useQueryClient();
  
  const prefetchChats = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.chat.myChats(),
      queryFn: createQueryFn<ChatsResponse>(() => chatService.getMyChats()),
      staleTime: 1 * 60 * 1000,
    });
  };

  const prefetchMessages = (chatId: string) => {
    queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.chat.messages(chatId),
      queryFn: ({ pageParam = 1 }) => {
        return createQueryFn<MessagesResponse>(() => 
          chatService.getMessages(chatId, pageParam, 20)
        )();
      },
      initialPageParam: 1,
      staleTime: 30 * 1000,
    });
  };

  return { prefetchChats, prefetchMessages };
};

// Hook for real-time chat updates (would work with Socket.IO)
export const useChatRealtime = (chatId: string) => {
  const queryClient = useQueryClient();
  
  // This would typically set up socket listeners
  // For now, it's a placeholder that could be extended with actual socket logic
  
  const handleNewMessage = (message: Message) => {
    queryClient.setQueryData(
      queryKeys.chat.messages(chatId),
      (oldData: any) => {
        if (!oldData) return oldData;

        // Check if message already exists (prevent duplicates)
        const existsInCache = oldData.pages.some((page: any) => 
          page.messages.some((msg: Message) => msg.id === message.id)
        );

        if (existsInCache) return oldData;

        const updatedPages = [...oldData.pages];
        if (updatedPages[0]) {
          updatedPages[0] = {
            ...updatedPages[0],
            messages: [message, ...updatedPages[0].messages],
          };
        }

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );

    // Update conversations list
    queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() });
  };

  return { handleNewMessage };
};