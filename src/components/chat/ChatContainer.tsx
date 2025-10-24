
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { chatService } from "@/services/chat.service";
import { socketService } from "@/services/socket.service";
import type { Message as MessageType, User, Conversation } from "@/types";
import { createQueryFn } from "@/utils/apiHelpers";
import { useAuth } from "@/hooks/useAuth";
import { TypingIndicator, LoadingSpinner } from "@/components/ui/loading-states";
import { Button } from "@/components/ui/button";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageStatus, type MessageWithStatus } from "@/types/chat";

export const ChatContainer = () => {
    const { chatId } = useParams<{ chatId: string }>();

    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [otherUser, setOtherUser] = useState<User | null>(null);

    // Real-time state
    const [isConnected, setIsConnected] = useState(socketService.isConnected());

    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [messageStatuses, setMessageStatuses] = useState<Map<string, MessageStatus>>(new Map());
    const [optimisticMessages, setOptimisticMessages] = useState<MessageWithStatus[]>([]);
    
    // UI state
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isJoiningChat, setIsJoiningChat] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    // Refs

    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { data: chats } = useQuery<Conversation[]>({
        queryKey: ['chats'],
        queryFn: createQueryFn(() => chatService.getMyChats()),
    });

    useEffect(() => {
        if (chats && chatId) {
            const currentChat = chats.find(chat => chat.id === chatId);
            if (currentChat) {
                setOtherUser(currentChat.otherUser);
            }
        }
    }, [chatId, chats]);


    const { data: serverMessages = [], isLoading, isError, error, refetch } = useQuery<MessageType[]>({
        queryKey: ['messages', chatId],
        queryFn: createQueryFn(() => chatService.getMessages(chatId!)),
        enabled: !!chatId,
        retry: (failureCount) => {
            // Retry up to 3 times with exponential backoff
            if (failureCount < 3) {
                setTimeout(() => refetch(), Math.pow(2, failureCount) * 1000);
                return false;
            }
            return false;
        }
    });

    // Combine server messages with optimistic messages
    const messages = [...serverMessages, ...optimisticMessages]
        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

    // Handle joining chat with loading state
    const joinChat = useCallback(async () => {
        if (!chatId) return;

        setIsJoiningChat(true);
        try {
            await socketService.joinChat(chatId);
        } catch (error) {
            console.error('Failed to join chat:', error);
            setConnectionError("Failed to join chat");
        } finally {
            setIsJoiningChat(false);
        }
    }, [chatId]);

    // Connection monitoring
    useEffect(() => {
        const handleConnectionChange = () => {
            setIsConnected(socketService.isConnected());
            if (socketService.isConnected()) {
                setConnectionError(null);
                // Rejoin chat if we were disconnected
                if (chatId) {
                    joinChat();
                }
            } else {
                setConnectionError("Connection lost");
                // Attempt reconnection
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
                reconnectTimeoutRef.current = setTimeout(() => {
                    socketService.reconnect().catch(err => {
                        setConnectionError(err.message || "Failed to reconnect");
                    });
                }, 2000);
            }
        };

        socketService.on('connect', handleConnectionChange);
        socketService.on('disconnect', handleConnectionChange);

        // Initial check
        handleConnectionChange();

        // Cleanup
        return () => {
            socketService.off('connect', handleConnectionChange);
            socketService.off('disconnect', handleConnectionChange);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [chatId, joinChat]);

    useEffect(() => {
        if (!chatId) return;

        // Real-time message handlers
        const handleNewMessage = (data: { messageId: string; content: string; senderId: string; chatId: string, media?: string[] }) => {
            if (data.chatId === chatId) {
                const newMessage: MessageType = {
                    id: data.messageId,
                    content: data.content,
                    senderId: data.senderId,
                    chatId: data.chatId,
                    sentAt: new Date().toISOString(),
                    media: data.media,
                };

                // Remove optimistic message if it exists
                setOptimisticMessages(prev =>
                    prev.filter(msg => msg.content !== newMessage.content || msg.senderId !== newMessage.senderId)
                );

                // Update server messages cache
                queryClient.setQueryData<MessageType[]>(['messages', chatId], (oldMessages = []) => {
                    if (oldMessages.some(msg => msg.id === newMessage.id)) {
                        return oldMessages;
                    }
                    return [...oldMessages, newMessage];
                });

                // Update message status
                setMessageStatuses(prev => new Map(prev.set(newMessage.id, MessageStatus.SENT)));
            }
        };

        const handleMessageDelivered = (data: { messageId: string; deliveredTo: string }) => {
            setMessageStatuses(prev => new Map(prev.set(data.messageId, MessageStatus.DELIVERED)));
        };

        const handleMessageRead = (data: { messageId: string; readBy: string }) => {
            setMessageStatuses(prev => new Map(prev.set(data.messageId, MessageStatus.READ)));
        };

        const handleUserTyping = (data: { userId: string; chatId: string }) => {
            if (data.chatId === chatId && data.userId !== user?.id) {
                setTypingUsers(prev => new Set(prev.add(data.userId)));
            }
        };

        const handleUserStoppedTyping = (data: { userId: string; chatId: string }) => {
            if (data.chatId === chatId) {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(data.userId);
                    return newSet;
                });
            }
        };

        const handleUserOnline = (data: { userId: string }) => {
            setOnlineUsers(prev => new Set(prev.add(data.userId)));
        };

        const handleUserOffline = (data: { userId: string }) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
        };

        // Join chat and setup listeners
        joinChat();

        socketService.on('new_message', handleNewMessage);
        socketService.on('message_delivered', handleMessageDelivered);
        socketService.on('message_read', handleMessageRead);
        socketService.on('user_typing', handleUserTyping);
        socketService.on('user_stopped_typing', handleUserStoppedTyping);
        socketService.on('user_online', handleUserOnline);
        socketService.on('user_offline', handleUserOffline);

        return () => {
            socketService.off('new_message', handleNewMessage);
            socketService.off('message_delivered', handleMessageDelivered);
            socketService.off('message_read', handleMessageRead);
            socketService.off('user_typing', handleUserTyping);
            socketService.off('user_stopped_typing', handleUserStoppedTyping);
            socketService.off('user_online', handleUserOnline);
            socketService.off('user_offline', handleUserOffline);
            socketService.leaveChat(chatId);
        };
    }, [chatId, queryClient, user?.id, joinChat]);

    // Handle typing indicators
    const handleStartTyping = useCallback(() => {
        if (!isConnected || !chatId) return;
        socketService.typingStart(chatId);
    }, [isConnected, chatId]);

    const handleStopTyping = useCallback(() => {
        if (!isConnected || !chatId) return;
        socketService.typingStop(chatId);
    }, [isConnected, chatId]);

    const sendMessageMutation = useMutation({
        mutationFn: async (content: string): Promise<void> => {
            if (!chatId || !user) throw new Error("Missing required data");

            setIsSendingMessage(true);

            // Create optimistic message
            const tempId = `temp_${Date.now()}_${Math.random()}`;
            const optimisticMessage: MessageWithStatus = {
                id: tempId,
                tempId,
                content,
                senderId: user.id,
                chatId,
                sentAt: new Date().toISOString(),
                media: [],
                status: MessageStatus.SENDING,
                isOptimistic: true
            };

            // Add optimistic message
            setOptimisticMessages(prev => [...prev, optimisticMessage]);
            setMessageStatuses(prev => new Map(prev.set(tempId, MessageStatus.SENDING)));

            try {
                await socketService.sendMessage(chatId, content, tempId);
                setMessageStatuses(prev => new Map(prev.set(tempId, MessageStatus.SENT)));
            } catch (error) {
                console.error('Failed to send message:', error);
                setMessageStatuses(prev => new Map(prev.set(tempId, MessageStatus.FAILED)));
                throw error;
            } finally {
                setIsSendingMessage(false);
            }
        },
        onError: (error) => {
            console.error('Send message error:', error);
            setConnectionError("Failed to send message");
        }
    });

    const handleSendMessage = useCallback((content: string) => {
        if (!isConnected) {
            setConnectionError("Not connected. Message will be sent when connection is restored.");
            return;
        }

        handleStopTyping();
        sendMessageMutation.mutate(content);
    }, [isConnected, handleStopTyping, sendMessageMutation]);

    const handleRetryConnection = useCallback(() => {
        setConnectionError(null);
        socketService.reconnect().catch(err => {
            setConnectionError(err.message || "Failed to reconnect");
        });
    }, []);

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div className="text-center">
                    <h3 className="text-lg font-medium text-red-800">Failed to load chat</h3>
                    <p className="text-red-600 mt-1">{error.message}</p>
                    <Button onClick={() => refetch()} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    const isOtherUserOnline = otherUser && onlineUsers.has(otherUser.id);
    const showTypingIndicator = typingUsers.size > 0;

    return (
        <div className="flex flex-col md:max-w-4xl h-full mx-auto relative">
            {/* Connection status bar */}
            {(!isConnected || connectionError) && (
                <div className={cn(
                    "flex items-center justify-between px-4 py-2 text-sm",
                    connectionError ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                )}>
                    <div className="flex items-center space-x-2">
                        {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                        <span>
                            {connectionError || (!isConnected ? "Connecting..." : "Connected")}
                        </span>
                    </div>
                    {connectionError && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleRetryConnection}
                            disabled={isJoiningChat}
                        >
                            {isJoiningChat ? <LoadingSpinner size="sm" /> : "Retry"}
                        </Button>
                    )}
                </div>
            )}

            <ChatHeader
                name={otherUser?.name || "..."}
                online={isOtherUserOnline || false}
                avatar={otherUser?.avatar || undefined}
                isTyping={showTypingIndicator}
            />

            {user && (
                <div className="flex-1 flex flex-col relative">
                    <Messages
                        messages={messages.map(msg => ({
                            ...msg,
                            status: messageStatuses.get(msg.id) || (msg as MessageWithStatus).status,
                            isOptimistic: (msg as MessageWithStatus).isOptimistic
                        }))}
                        currentUserId={user.id}
                        loading={isLoading}
                        chatId={chatId}
                    />

                    {/* Typing indicator */}
                    {showTypingIndicator && (
                        <div className="px-4 py-2 border-t">
                            <TypingIndicator userName={otherUser?.name} />
                        </div>
                    )}
                </div>
            )}

            <MessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleStartTyping}
                chatId={chatId!}
                disabled={!isConnected || isSendingMessage}
                useContext={false}
            />

            {/* Loading overlay for joining chat */}
            {isJoiningChat && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
                    <LoadingSpinner text="Joining chat..." />
                </div>
            )}
        </div>
    );
};
