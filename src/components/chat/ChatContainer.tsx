import { useCallback, useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import MessageInput from "./MessageInput";
import type { Message as MessageType } from "@/types/index";
import type { Conversation } from "@/types/index";
import { useAuth } from "@/contexts/AuthContext";
import SocketService, { socketService } from "@/services/socket-service";
import { useParams } from "react-router-dom";


interface ChatContainerProps {
    conversation: Conversation;
}

const ChatContainer = ({ conversation }: ChatContainerProps) => {
    // get the chat id from the param
    const { chatId } = useParams<{ chatId: string }>();

    const { user } = useAuth();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isTyping, setIsTyping] = useState<Set<string>>(new Set());
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Load initial messages when component mounts
    useEffect(() => {
        const loadInitialMessages = async () => {
            try {

                // later we will fetch the API to get the chat history from db 
                const mockMessages: MessageType[] = [
                    {
                        id: 'msg1',
                        senderId: conversation.participantId,
                        senderName: conversation.participantName,
                        content: 'Hey! Is this item still available?',
                        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
                        isRead: true,
                        isDelivered: true,
                        avatar: conversation.participantAvatar
                    }
                ];

                setMessages(mockMessages);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };

        if (chatId) {
            loadInitialMessages();
        }
    }, [chatId, conversation]);

    // Initialize socket connection
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const initializeSocket = async () => {
            try {
                const socket = SocketService.getInstance();

                // Get token from localStorage or user context
                const token = "since the auth systen has not been implemented yet";

                // Your backend URL
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
                await socket.connect(token, backendUrl);

                setIsConnected(socket.isConnected());
                setConnectionError(null);
                console.log("Socket connected successfully");

            } catch (error) {
                console.error("Socket connection failed:", error);
                setConnectionError("Failed to connect to chat server");
                setIsConnected(false);
            } finally {
                setLoading(false);
            }
        };

        if (!socketService.isConnected()) {
            initializeSocket();
        } else {
            setIsConnected(true);
            setLoading(false);
        }
    }, [user]);

    // Join/Leave chat when chatId or connection changes
    useEffect(() => {
        if (isConnected && chatId) {
            socketService.joinChat(chatId);
            console.log("Joined chat:", chatId);

            return () => {
                socketService.leaveChat(chatId);
                console.log("Left chat:", chatId);
            };
        }
    }, [isConnected, chatId]);

    // Socket event listeners - matching your backend exactly
    useEffect(() => {
        if (!isConnected) return;

        // Backend: socket.emit('connected', { userId });
        const handleConnected = (data: { userId: string }) => {
            console.log('Connected as user:', data.userId);
        };

        // Backend: socket.emit('joined_chat', { chatId });
        const handleJoinedChat = (data: { chatId: string }) => {
            console.log('Successfully joined chat:', data.chatId);
        };

        // Backend: socket.emit('left_chat', { chatId });
        const handleLeftChat = (data: { chatId: string }) => {
            console.log('Successfully left chat:', data.chatId);
        };

        // Backend: socket.to(`chat:${chatId}`).emit('user_online', { userId });
        const handleUserOnline = (data: { userId: string }) => {
            setOnlineUsers(prev => new Set([...prev, data.userId]));
            console.log(`User ${data.userId} came online`);
        };

        // Backend: socket.to(`chat:${chatId}`).emit('user_offline', { userId });
        const handleUserOffline = (data: { userId: string }) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
            console.log(`User ${data.userId} went offline`);
        };

        // Backend: this.io.to(`chat:${chatId}`).emit('new_message', { messageId, content, senderId, chatId });
        const handleNewMessage = (data: {
            messageId: string;
            content: string;
            senderId: string;
            chatId: string;
            timestamp?: string;
        }) => {
            if (data.chatId === chatId) {
                const newMessage: MessageType = {
                    id: data.messageId,
                    senderId: data.senderId,
                    senderName: data.senderId === user?.id ? "You" : conversation.participantName,
                    content: data.content,
                    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
                    isRead: false,
                    isDelivered: true,
                    avatar: data.senderId === user?.id ? user?.picture : conversation.participantAvatar
                };

                setMessages(prev => [...prev, newMessage]);

                // Auto-mark as delivered if not from current user
                if (data.senderId !== user?.id) {
                    socketService.markDelivered(data.messageId);
                }

                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        };

        // Backend: this.io.to(senderSocketId).emit('message_delivered', { messageId, deliveredTo });
        const handleMessageDelivered = (data: { messageId: string; deliveredTo: string }) => {
            setMessages(prev => prev.map(msg =>
                msg.id === data.messageId
                    ? { ...msg, isDelivered: true }
                    : msg
            ));
        };

        // Backend: this.io.to(senderSocketId).emit('message_read', { messageId, readBy });
        const handleMessageRead = (data: { messageId: string; readBy: string }) => {
            setMessages(prev => prev.map(msg =>
                msg.id === data.messageId
                    ? { ...msg, isRead: true }
                    : msg
            ));
        };

        // Backend: socket.to(`chat:${chatId}`).emit('user_typing', { userId, chatId });
        const handleUserTyping = (data: { userId: string; chatId: string }) => {
            if (data.chatId === chatId && data.userId !== user?.id) {
                setIsTyping(prev => new Set([...prev, data.userId]));

                setTimeout(() => {
                    setIsTyping(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(data.userId);
                        return newSet;
                    });
                }, 3000);
            }
        };

        // Backend: socket.to(`chat:${chatId}`).emit('user_stopped_typing', { userId, chatId });
        const handleUserStoppedTyping = (data: { userId: string; chatId: string }) => {
            if (data.chatId === chatId) {
                setIsTyping(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(data.userId);
                    return newSet;
                });
            }
        };

        // Backend: socket.emit('error', { message });
        const handleError = (data: { message: string }) => {
            console.error('Socket error:', data.message);
            setConnectionError(data.message);

            setTimeout(() => {
                setConnectionError(null);
            }, 5000);
        };

        // Built-in Socket.IO events
        const handleConnect = () => {
            console.log('Socket reconnected');
            setIsConnected(true);
            setConnectionError(null);
        };

        const handleDisconnect = (reason: string) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
            if (reason === 'io server disconnect') {
                setConnectionError('Server disconnected');
            }
        };

        const handleConnectError = (error: Error) => {
            console.error('Socket connection error:', error);
            setConnectionError(`Connection failed: ${error.message}`);
            setIsConnected(false);
            setLoading(false);
        };

        // register event listeners
        socketService.on("connected", handleConnected);
        socketService.on("joined_chat", handleJoinedChat);
        socketService.on("left_chat", handleLeftChat);
        socketService.on("user_online", handleUserOnline);
        socketService.on("user_offline", handleUserOffline);
        socketService.on("new_message", handleNewMessage);
        socketService.on("message_delivered", handleMessageDelivered);
        socketService.on("message_read", handleMessageRead);
        socketService.on("user_typing", handleUserTyping);
        socketService.on("user_stopped_typing", handleUserStoppedTyping);
        socketService.on("error", handleError);

        // Built-in Socket.IO events
        socketService.on("connect", handleConnect);
        socketService.on("connect_error", handleConnectError);
        socketService.on("disconnect", handleDisconnect);

        // Cleanup event listeners
        return () => {
            socketService.off("connected", handleConnected);
            socketService.off("joined_chat", handleJoinedChat);
            socketService.off("left_chat", handleLeftChat);
            socketService.off("user_online", handleUserOnline);
            socketService.off("user_offline", handleUserOffline);
            socketService.off("new_message", handleNewMessage);
            socketService.off("message_delivered", handleMessageDelivered);
            socketService.off("message_read", handleMessageRead);
            socketService.off("user_typing", handleUserTyping);
            socketService.off("user_stopped_typing", handleUserStoppedTyping);
            socketService.off("error", handleError);
            socketService.off("connect", handleConnect);
            socketService.off("connect_error", handleConnectError);
            socketService.off("disconnect", handleDisconnect);
        };
    }, [isConnected, chatId, user, conversation]);

    // Typing handler
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);


    const handleTyping = useCallback(() => {
        if (chatId && isConnected) {

            socketService.typingStart(chatId);

            // Clear existing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            // Set timeout to stop typing indicator
            const newTimeout = setTimeout(() => {

                socketService.typingStop(chatId);
            }, 1000);

            setTypingTimeout(newTimeout);
        }
    }, [chatId, isConnected, typingTimeout]);


    // client-> server
    // Send message handler
    const handleSendMessage = useCallback((content: string) => {
        if (content.trim() && chatId && isConnected) {

            socketService.sendMessage(chatId, content.trim());

            // Clear typing indicator
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                setTypingTimeout(null);
            }
            socketService.typingStop(chatId);
        }
    }, [chatId, isConnected, typingTimeout]);

    // Auto-scroll when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-mark messages as read when they come into view
    useEffect(() => {
        const unreadMessages = messages.filter(msg =>
            !msg.isRead && msg.senderId !== user?.id
        );

        unreadMessages.forEach(msg => {

            socketService.markRead(msg.id);
        });
    }, [messages, user?.id]);

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-b from-background to-muted/20">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground animate-pulse">Connecting to chat...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Connection error state
    if (connectionError) {
        return (
            <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-b from-background to-muted/20">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-sm">!</span>
                        </div>
                        <p className="text-muted-foreground mb-2">Connection Error</p>
                        <p className="text-sm text-red-600">{connectionError}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Retry Connection
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isParticipantOnline = onlineUsers.has(conversation.participantId);
    const isParticipantTyping = isTyping.has(conversation.participantId);

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto bg-gradient-to-b from-background to-muted/20 my-auto">
            <ChatHeader
                name={conversation.participantName}
                online={isParticipantOnline}
                avatar={conversation.participantAvatar}
            />

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-8">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <Message
                            key={message.id}
                            message={message}
                            isSent={message.senderId === user?.id}
                        />
                    ))
                )}

                {isParticipantTyping && (
                    <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg max-w-16">
                            <div className="flex space-x-1 justify-center">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <MessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                disabled={!isConnected}
            />
        </div>
    );
};

export default ChatContainer;
