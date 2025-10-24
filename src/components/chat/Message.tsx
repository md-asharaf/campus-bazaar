import { cn } from "@/lib/utils";
import type { Message as MessageType } from "@/types/index";
import { CheckCheck } from "lucide-react";
import ImageMessage from "./ImageMessage";
import { MessageStatusIndicator, PulseWrapper } from "@/components/ui/loading-states";
import { MessageStatus } from "@/types/chat";

interface MessageProps {
    message: MessageType & {
        status?: MessageStatus;
        isOptimistic?: boolean;
    };
    isSent: boolean;
    showStatus?: boolean;
    status?: MessageStatus;
}

const Message = ({ message, isSent, showStatus, status }: MessageProps) => {
    const formatTime = (dateString: string | Date) => {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const hasImages = message.media && message.media.length > 0;
    const isOptimistic = message.isOptimistic;
    const messageStatus = status || message.status || (message.readAt ? MessageStatus.READ : message.deliveredAt ? MessageStatus.DELIVERED : MessageStatus.SENT);

    return (
        <div className={cn(
            "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
            isSent ? "justify-end" : "justify-start"
        )}>
            <PulseWrapper isLoading={!!isOptimistic} className="max-w-[70%]">
                <div className={cn(
                    "rounded-2xl shadow-sm transition-all hover:shadow-md relative",
                    hasImages ? "overflow-hidden" : "px-4 py-2.5",
                    isSent
                        ? "bg-[hsl(var(--chat-sent))] text-[hsl(var(--chat-sent-foreground))] rounded-br-md"
                        : "bg-[hsl(var(--chat-received))] text-[hsl(var(--chat-received-foreground))] rounded-bl-md",
                    isOptimistic && "opacity-70"
                )}>
                    {hasImages && (
                        <ImageMessage media={message.media!} />
                    )}

                    {message.content && (
                        <p className={cn(
                            "text-sm leading-relaxed wrap-break-word",
                            hasImages && "px-4 pt-2 pb-1"
                        )}>
                            {message.content}
                        </p>
                    )}

                    <div className={cn(
                        "flex items-center justify-end mt-1 space-x-1",
                        hasImages && "px-4 pb-2"
                    )}>
                        <span className={cn(
                            "text-[10px]",
                            isSent ? "text-white/70" : "text-muted-foreground"
                        )}>
                            {formatTime(message.sentAt)}
                        </span>
                        
                        {isSent && (showStatus && typeof messageStatus === 'string' ? (
                            <MessageStatusIndicator 
                                status={messageStatus as any} 
                                className="ml-1" 
                            />
                        ) : (
                            <CheckCheck
                                className={cn(
                                    "ml-1.5 h-4 w-4",
                                    message.readAt ? "text-blue-500" : "text-gray-400"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </PulseWrapper>
        </div>
    );
};

export default Message;
