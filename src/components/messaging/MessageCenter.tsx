import React, { useState } from "react";
import { MessageCircle, Send ,CheckCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    avatar?: string;
}

interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantAvatar?: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    itemTitle?: string;
    itemPrice?: string;
    itemImage?: string;
}

// Mock data for conversations
const mockConversations: Conversation[] = [
    {
        id: "1",
        participantId: "user1",
        participantName: "Priya Sharma",
        participantAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        lastMessage: "Is the laptop still available?",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unreadCount: 2,
        itemTitle: "MacBook Pro 2021",
        itemPrice: "₹85,000",
        itemImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop"
    },
    {
        id: "2",
        participantId: "user2",
        participantName: "Arjun Patel",
        participantAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
        lastMessage: "Thanks for the quick response!",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 0,
        itemTitle: "Engineering Textbooks Set",
        itemPrice: "₹2,500",
        itemImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=100&h=100&fit=crop"
    },
    {
        id: "3",
        participantId: "user3",
        participantName: "Sneha Reddy",
        participantAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
        lastMessage: "Can we meet at the library tomorrow?",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        unreadCount: 1,
        itemTitle: "Study Table",
        itemPrice: "₹3,200",
        itemImage: "https://images.unsplash.com/photo-1586942593565-47dbbda2f5d4?w=100&h=100&fit=crop"
    }
];

// Mock messages for a conversation
const mockMessages: Message[] = [
    {
        id: "1",
        senderId: "user1",
        senderName: "Priya Sharma",
        content: "Hi! I'm interested in your MacBook Pro. Is it still available?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        isRead: true
    },
    {
        id: "2",
        senderId: "me",
        senderName: "You",
        content: "Yes, it's still available! It's in excellent condition, barely used for 6 months.",
        timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
        isRead: true
    },
    {
        id: "3",
        senderId: "user1",
        senderName: "Priya Sharma",
        content: "Great! Can you tell me more about the specifications and any issues?",
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        isRead: true
    },
    {
        id: "4",
        senderId: "me",
        senderName: "You",
        content: "It's the M1 Pro model with 16GB RAM and 512GB SSD. No issues at all, comes with original charger and box.",
        timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
        isRead: true
    },
    {
        id: "5",
        senderId: "user1",
        senderName: "Priya Sharma",
        content: "Perfect! When can we meet on campus to check it out?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false
    }
];

export const MessageCenter: React.FC = () => {
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [conversations] = useState<Conversation[]>(mockConversations);
    const [messages] = useState<Message[]>(mockMessages);

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d ago`;
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // In a real app, this would send the message to the backend
            console.log("Sending message:", newMessage);
            setNewMessage("");
        }
    };

    const selectedConv = conversations.find(c => c.id === selectedConversation);

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Messages</h1>
                <p className="text-muted-foreground">Chat with fellow students about your listings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Conversations List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Conversations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-1 max-h-[500px] overflow-y-auto">
                            {conversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    onClick={() => setSelectedConversation(conversation.id)}
                                    className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 border-b border-border/50 ${
                                        selectedConversation === conversation.id ? 'bg-muted' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative">
                                            <img
                                                src={conversation.participantAvatar}
                                                alt={conversation.participantName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            {conversation.unreadCount > 0 && (
                                                <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {conversation.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {conversation.participantName}
                                                </h3>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTime(conversation.lastMessageTime)}
                                                </span>
                                            </div>
                                            {conversation.itemTitle && (
                                                <div className="flex items-center gap-2 mb-1">
                                                    <img
                                                        src={conversation.itemImage}
                                                        alt={conversation.itemTitle}
                                                        className="w-6 h-6 rounded object-cover"
                                                    />
                                                    <span className="text-xs text-blue-600 font-medium truncate">
                                                        {conversation.itemTitle}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-sm text-muted-foreground truncate">
                                                {conversation.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Chat Area */}
                <Card className="lg:col-span-2">
                    {selectedConv ? (
                        <>
                            {/* Chat Header */}
                            <CardHeader className="border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={selectedConv.participantAvatar}
                                        alt={selectedConv.participantName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{selectedConv.participantName}</h3>
                                        {selectedConv.itemTitle && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>About:</span>
                                                <span className="text-blue-600 font-medium">
                                                    {selectedConv.itemTitle}
                                                </span>
                                                <span className="text-green-600 font-semibold">
                                                    {selectedConv.itemPrice}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            {/* Messages */}
                            <CardContent className="p-4">
                                <div className="space-y-4 max-h-[350px] overflow-y-auto mb-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${
                                                message.senderId === 'me' ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`max-w-[70%] p-3 rounded-lg ${
                                                    message.senderId === 'me'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-muted text-foreground'
                                                }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className={`text-xs ${
                                                        message.senderId === 'me' ? 'text-blue-100' : 'text-muted-foreground'
                                                    }`}>
                                                        {formatTime(message.timestamp)}
                                                    </span>
                                                    {message.senderId === 'me' && (
                                                        <CheckCheck className={`h-3 w-3 ${
                                                            message.isRead ? 'text-blue-200' : 'text-blue-300'
                                                        }`} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your message..."
                                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="px-4 py-2"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <CardContent className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                                <p className="text-muted-foreground">
                                    Choose a conversation from the left to start chatting
                                </p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
};