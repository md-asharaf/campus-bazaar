// API Response Type
export interface ApiResponse<T = any> {
    message: string;
    success: boolean;
    data: T;
}

// Enums
export enum AdminRole {
    SUPER = "SUPER",
    SUB = "SUB",
}

export enum VerificationStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED",
}

export enum ImageStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

// Models
export interface Admin {
    id: string;
    role: AdminRole;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    bio?: string | null;
    phone?: string | null;
    isVerified: boolean;
    isActive: boolean;
    registrationNo: string;
    branch: string;
    year: number;
    createdAt: string;
    updatedAt: string;
    wishlists?: Wishlist[];
    feedback?: Feedback | null;
    messages?: Message[];
    chatsAsUser1?: Chat[];
    chatsAsUser2?: Chat[];
}

export interface Verification {
    id: string;
    userId: string;
    imageId: string;
    status: VerificationStatus;
    createdAt: string;
    updatedAt: string;
    image?: Image;
}

export interface Image {
    id: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    items?: Item[];
    verifications?: Verification[];
    Category?: Category[];
    media?: string[];
}

export interface Item {
    id: string;
    title: string;
    price: number;
    sellerId: string;
    isVerified: boolean;
    seller?: User;
    isSold: boolean;
    categoryId?: string | null;
    createdAt: string;
    updatedAt: string;
    images?: Image[];
    category?: Category | null;
    wishlists?: Wishlist[];
}

export interface Category {
    id: string;
    name: string;
    imageId?: string | null;
    image?: Image | null;
    createdAt: string;
    updatedAt: string;
    items?: Item[];
}

export interface Wishlist {
    id: string;
    userId: string;
    itemId: string;
    createdAt: string;
    user?: User;
    item?: Item;
}

export interface Feedback {
    id: string;
    content: string;
    rating: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    chatId: string;
    deliveredAt?: string | null;
    readAt?: string | null;
    sentAt: string;
    sender?: User;
    chat?: Chat;
    media?: string[];
}

export interface Media {
    id: string;
    imageId: string;
    messageId: string;
    createdAt: string;
    updatedAt: string;
    message?: Message;
    image?: Image;
}

export interface Chat {
    id: string;
    user1_id: string;
    user2_id: string;
    createdAt: string;
    updatedAt: string;
    user1?: User;
    user2?: User;
    messages?: Message[];
}

export interface Conversation {
    id: string;
    otherUser: User;
    latestMessage: Message;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
}