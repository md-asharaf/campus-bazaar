import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/index";
import { Badge } from "../ui/badge";
import { Check, CheckCheck } from "lucide-react";
import { getConversationDisplayData } from "@/utils/chatHelpers";

interface ConversationItemProps {
    conversation: Conversation;
    onClick: () => void;
}

const ChatItem = ({ conversation, onClick }: ConversationItemProps) => {
    // Get all display data using utility functions
    const displayData = getConversationDisplayData(conversation);

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 p-4 hover:bg-muted/50 active:bg-muted/70 cursor-pointer transition-all duration-150 group"
        >
            {/* Avatar with online indicator */}
            <div className="relative shrink-0">
                <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
                    <AvatarImage
                        src={displayData.avatarUrl}
                        alt={displayData.displayName}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-medium">
                        {displayData.initials}
                    </AvatarFallback>
                </Avatar>
                {displayData.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
                {/* Top row: Name and Time */}
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate text-sm">
                        {displayData.displayName}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                        {displayData.timeDisplay && (
                            <span className="text-xs text-muted-foreground">
                                {displayData.timeDisplay}
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom row: Message preview and status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                        {/* Message status for sent messages */}
                        {conversation?.latestMessage?.senderId !== conversation?.otherUser?.id && conversation?.latestMessage && (
                            <div className="shrink-0">
                                {Math.random() > 0.5 ? (
                                    <CheckCheck className="w-3 h-3 text-blue-500" />
                                ) : (
                                    <Check className="w-3 h-3 text-muted-foreground" />
                                )}
                            </div>
                        )}

                        <p className={cn(
                            "text-sm truncate transition-colors",
                            displayData.hasUnread
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                        )}>
                            {displayData.messagePreview}
                        </p>
                    </div>

                    {/* Unread badge */}
                    {displayData.hasUnread && (
                        <Badge className="ml-2 bg-primary text-primary-foreground rounded-full h-5 min-w-5 px-1.5 text-xs font-medium flex items-center justify-center">
                            {displayData.unreadDisplay}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;