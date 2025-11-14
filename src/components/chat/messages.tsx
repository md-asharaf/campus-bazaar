import React, { useEffect, useRef, useState, useCallback } from 'react';
import Message from './message';
import { MessageListSkeleton } from './messages-list-skeleton';
import { TypingIndicator, LoadingSpinner, MessageSendingSkeleton } from '@/components/ui/loading-states';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MessageWithStatus } from '@/types/chat';
import { useChat } from '@/hooks/use-chat';

interface MessagesProps {
    messages: MessageWithStatus[];
    currentUserId: string;
    loading: boolean;
    chatId?: string;
    onLoadMore?: () => void;
    hasMore?: boolean;
    loadingMore?: boolean;
}

const Messages: React.FC<MessagesProps> = ({ 
    messages: propMessages, 
    currentUserId, 
    loading, 
    chatId,
    onLoadMore,
    hasMore = false,
    loadingMore = false
}) => {
    // Try to use chat context if available, but don't require it
    let state;
    try {
        const chatContext = useChat();
        state = chatContext.state;
    } catch {
        state = {
            currentChat: null,
            messages: [],
            loadingStates: { loadingMessages: false, sendingMessage: false },
            hasMoreMessages: false,
            typingUsers: new Set(),
            otherUser: null
        };
    }
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isUserScrolling, setIsUserScrolling] = useState(false);



    // Use messages from context if available, otherwise use props
    const messages = chatId === state.currentChat?.id ? state.messages : propMessages;

    const scrollToBottom = useCallback((smooth = true) => {
        messagesEndRef.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto"
        });
        setShowScrollToBottom(false);
        setIsUserScrolling(false);
    }, []);

    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

        setShowScrollToBottom(!isAtBottom && messages.length > 0);
        setIsUserScrolling(scrollTop < scrollHeight - clientHeight - 100);
    }, [messages.length]);

    // Auto-scroll on new messages (only if user is not scrolling)
    useEffect(() => {
        if (!isUserScrolling) {
            const timer = setTimeout(() => scrollToBottom(), 100);
            return () => clearTimeout(timer);
        }
    }, [messages.length, isUserScrolling, scrollToBottom]);

    // Intersection observer for loading more messages
    useEffect(() => {
        if (!messagesContainerRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && onLoadMore) {
                    // Load more messages when scrolled to top
                    onLoadMore();
                }
            },
            { threshold: 1.0 }
        );

        const firstMessage = messagesContainerRef.current.firstElementChild;
        if (firstMessage) {
            observer.observe(firstMessage);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, onLoadMore]);

    if (loading && messages.length === 0) {
        return <MessageListSkeleton />;
    }

    const typingUserNames = Array.from(state.typingUsers || new Set()).filter(userId => userId !== currentUserId);
    const hasTypingUsers = typingUserNames.length > 0;

    return (
        <div className="flex-1 flex flex-col relative">
            {/* Messages container */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 scroll-smooth"
                onScroll={handleScroll}
            >
                {/* Load more button and indicator */}
                {hasMore && (
                    <div className="flex justify-center py-4">
                        {loadingMore ? (
                            <LoadingSpinner text="Loading messages..." />
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onLoadMore}
                                className="text-xs"
                            >
                                Load More Messages
                            </Button>
                        )}
                    </div>
                )}

                {/* Messages */}
                {messages?.map((message: MessageWithStatus, index: number) => (
                    <div key={message.id || message.tempId || index}>
                        <Message
                            message={message}
                            isSent={message.senderId === currentUserId}
                            showStatus={message.isOptimistic || message.status !== undefined}
                            status={message.status}
                        />
                    </div>
                ))}

                {/* Optimistic message being sent */}
                {state.loadingStates?.sendingMessage && (
                    <MessageSendingSkeleton />
                )}

                {/* Typing indicator */}
                {hasTypingUsers && (
                    <TypingIndicator
                        userName={state.otherUser?.name}
                        className="mb-4"
                    />
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            {showScrollToBottom && (
                <div className="absolute bottom-4 right-4 z-10">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => scrollToBottom()}
                        className={cn(
                            "rounded-full shadow-lg transition-all duration-200",
                            "bg-white/90 backdrop-blur-sm hover:bg-white",
                            "border border-gray-200"
                        )}
                    >
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Scroll to bottom</span>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Messages;
