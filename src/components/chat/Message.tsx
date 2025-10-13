import { cn } from "@/lib/utils";
import type { Message as MessageType } from "@/types/index";
import { CheckCheck } from "lucide-react";

interface MessageProps {
    message: MessageType;
    isSent: boolean;
}

const Message = ({ message, isSent }: MessageProps) => {
    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return (
        <div className={cn(
            "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
            isSent ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm transition-all hover:shadow-md",
                isSent
                    ? "bg-[hsl(var(--chat-sent))] text-[hsl(var(--chat-sent-foreground))] rounded-br-md"
                    : "bg-[hsl(var(--chat-received))] text-[hsl(var(--chat-received-foreground))] rounded-bl-md"
            )}>

                <p className="text-sm leading-relaxed break-words">{message.content}</p>
                <div className="flex items-center justify-end mt-1">
                    <span className={cn(
                        "text-[10px]",
                        isSent ? "text-white/70" : "text-muted-foreground"
                    )}>
                        {formatTime(message.timestamp)}
                    </span>
                    {isSent && (
                        <CheckCheck
                            className={cn(
                                "ml-1.5 h-4 w-4",
                                message.isRead ? "text-blue-500" : "text-gray-400"
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
