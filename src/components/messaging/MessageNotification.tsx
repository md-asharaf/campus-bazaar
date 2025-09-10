import React from "react";
import { MessageCircle } from "lucide-react";

interface MessageNotificationProps {
    unreadCount?: number;
    onClick?: () => void;
}

export const MessageNotification: React.FC<MessageNotificationProps> = ({ 
    unreadCount = 0, 
    onClick 
}) => {
    return (
        <button
            onClick={onClick}
            className="relative p-2 rounded-full text-white hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
            aria-label={`Messages ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
            <MessageCircle size={20} />
            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </div>
            )}
        </button>
    );
};