// src/types/index.ts
export interface Category {
    icon: string;
    name: string;
    count: number;
}

export interface Listing {
    id: number;
    title: string;
    price: string;
    image: string;
}

export interface Testimonial {
    quote: string;
    author: string;
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    avatar?: string;
    isDelivered: boolean
}

export interface Conversation {
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