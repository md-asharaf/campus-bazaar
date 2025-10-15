import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/index";

interface ConversationItemProps {
    conversation: Conversation;
    onClick: () => void;
}

const ChatItem = ({ conversation, onClick }: ConversationItemProps) => {
    const formatTime = (dateString: string) => {
        try {
            const now = new Date();
            const messageDate = new Date(dateString);

            // Check for invalid date
            if (isNaN(messageDate.getTime())) {
                return 'Invalid date';
            }

            const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
        } catch (error) {
            console.error('Error formatting time:', error);
            return '';
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    console.log("Rendering ChatItem for conversation:", conversation);

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border last:border-0"
        >
            <Avatar className="h-12 w-12">
                <AvatarImage
                    src={conversation?.otherUser.avatar}
                    alt={conversation?.otherUser.name}
                />
                <AvatarFallback>{getInitials(conversation?.otherUser.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                        {conversation?.otherUser.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                        {conversation.latestMessage
                            ? formatTime(conversation.latestMessage.createdAt)
                            : formatTime(conversation.createdAt)
                        }
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <p className={cn(
                        "text-sm truncate",
                        conversation.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                        {conversation.latestMessage
                            ? conversation.latestMessage.content
                            : "No messages yet"
                        }
                    </p>
                    {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 bg-primary text-primary-foreground rounded-full h-5 min-w-5 px-1.5">
                            {conversation.unreadCount}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
