import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";
import ChatItem from "./ChatItem";
import type { Conversation } from "@/types/index";


const ChatList = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            try {

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/chat/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data = await response.json();
                setConversations(data.conversations);
                setError(null);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                setError("Failed to fetch conversations");
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col h-screen max-w-4xl mx-auto bg-background">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading conversations...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen max-w-4xl mx-auto bg-background">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto bg-background px-4 py-8 sm:py-12 md:py-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Messages</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {conversations.length} Chats{conversations.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                    <div className="space-y-2">
                        {conversations.map((conversation) => (
                            <ChatItem
                                key={conversation.id}
                                conversation={conversation}
                                onClick={() => navigate(`/chat/with/${conversation.otherUser.id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <MessageSquarePlus className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No conversations yet</p>
                        <p className="text-sm mt-2">Start chatting with someone to see conversations here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
