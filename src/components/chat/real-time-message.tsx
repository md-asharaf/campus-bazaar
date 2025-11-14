import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import type { Message as MessageType } from "@/types/index";
import { CheckCheck, Clock, AlertCircle, Loader2 } from "lucide-react";
import ImageMessage from "./ImageMessage";
import { MessageStatus } from "@/types/chat";

interface RealtimeMessageProps {
  message: MessageType;
  isSent: boolean;
  status?: MessageStatus;
  isOptimistic?: boolean;
}

const RealtimeMessage = ({ message, isSent, status, isOptimistic }: RealtimeMessageProps) => {
  const [currentStatus, setCurrentStatus] = useState<MessageStatus>(status || MessageStatus.SENT);

  useEffect(() => {
    if (status) {
      setCurrentStatus(status);
    }
  }, [status]);

  const formatTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case MessageStatus.SENDING:
        return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />;
      case MessageStatus.SENT:
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case MessageStatus.DELIVERED:
        return <CheckCheck className="h-3 w-3 text-gray-500" />;
      case MessageStatus.READ:
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case MessageStatus.FAILED:
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const hasImages = message.media && message.media.length > 0;

  return (
    <div className={cn(
      "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isSent ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-2xl shadow-sm transition-all hover:shadow-md relative",
        hasImages ? "overflow-hidden" : "px-4 py-2.5",
        isSent
          ? "bg-[hsl(var(--chat-sent))] text-[hsl(var(--chat-sent-foreground))] rounded-br-md"
          : "bg-[hsl(var(--chat-received))] text-[hsl(var(--chat-received-foreground))] rounded-bl-md",
        isOptimistic && "opacity-70 animate-pulse",
        currentStatus === MessageStatus.FAILED && "border-2 border-red-300"
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
          
          {isSent && (
            <div className="ml-1">
              {getStatusIcon()}
            </div>
          )}
        </div>

        {/* Retry button for failed messages */}
        {currentStatus === MessageStatus.FAILED && (
          <button
            onClick={() => setCurrentStatus(MessageStatus.SENDING)}
            className="absolute -bottom-8 right-0 text-xs text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default RealtimeMessage;