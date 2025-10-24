import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Check, CheckCheck, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Message status indicator
interface MessageStatusIndicatorProps {
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  className?: string;
}

export const MessageStatusIndicator = ({ status, className }: MessageStatusIndicatorProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'sent':
        return <Check className="h-3 w-3" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <X className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'sending':
        return 'text-gray-400';
      case 'sent':
        return 'text-gray-400';
      case 'delivered':
        return 'text-gray-500';
      case 'read':
        return 'text-blue-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={cn(getStatusColor(), className)}>
      {getStatusIcon()}
    </div>
  );
};

// Typing indicator
interface TypingIndicatorProps {
  userName?: string;
  className?: string;
}

export const TypingIndicator = ({ userName, className }: TypingIndicatorProps) => {
  return (
    <div className={cn("flex items-center space-x-2 px-4 py-2", className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-500">
        {userName ? `${userName} is typing...` : 'Someone is typing...'}
      </span>
    </div>
  );
};

// Message sending skeleton
export const MessageSendingSkeleton = () => {
  return (
    <div className="flex justify-end mb-4 animate-pulse">
      <div className="max-w-[70%] bg-blue-100 rounded-2xl rounded-br-md px-4 py-2.5">
        <Skeleton className="h-4 w-32 mb-1" />
        <div className="flex items-center justify-end mt-1">
          <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
        </div>
      </div>
    </div>
  );
};

// Connection status indicator
interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';
  className?: string;
}

export const ConnectionStatus = ({ status, className }: ConnectionStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connecting':
        return {
          color: 'text-yellow-500 bg-yellow-50 border-yellow-200',
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: 'Connecting...'
        };
      case 'connected':
        return {
          color: 'text-green-500 bg-green-50 border-green-200',
          icon: <Check className="h-4 w-4" />,
          text: 'Connected'
        };
      case 'disconnected':
        return {
          color: 'text-gray-500 bg-gray-50 border-gray-200',
          icon: <X className="h-4 w-4" />,
          text: 'Disconnected'
        };
      case 'reconnecting':
        return {
          color: 'text-orange-500 bg-orange-50 border-orange-200',
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: 'Reconnecting...'
        };
      case 'error':
        return {
          color: 'text-red-500 bg-red-50 border-red-200',
          icon: <X className="h-4 w-4" />,
          text: 'Connection Error'
        };
      default:
        return {
          color: 'text-gray-500 bg-gray-50 border-gray-200',
          icon: <Clock className="h-4 w-4" />,
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn(
      "flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium",
      config.color,
      className
    )}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

// Message input loading overlay
export const MessageInputLoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <div className="flex items-center space-x-2 text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Sending...</span>
      </div>
    </div>
  );
};

// Chat list loading skeleton
export const ChatListSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 animate-pulse">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Message loading skeleton
export const MessageListSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={cn(
          "flex w-full animate-pulse",
          i % 3 === 0 ? "justify-end" : "justify-start"
        )}>
          <div className={cn(
            "max-w-[70%] rounded-2xl p-4 space-y-2",
            i % 3 === 0 ? "bg-blue-100 rounded-br-md" : "bg-gray-100 rounded-bl-md"
          )}>
            <Skeleton className="h-4 w-full" />
            {i % 4 === 0 && <Skeleton className="h-4 w-3/4" />}
            <div className="flex justify-end">
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Image upload loading
export const ImageUploadLoading = () => {
  return (
    <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Uploading images...</span>
    </div>
  );
};

// Online status dot
interface OnlineStatusDotProps {
  isOnline: boolean;
  className?: string;
}

export const OnlineStatusDot = ({ isOnline, className }: OnlineStatusDotProps) => {
  return (
    <div className={cn(
      "w-3 h-3 rounded-full border-2 border-white",
      isOnline ? "bg-green-500" : "bg-gray-400",
      className
    )} />
  );
};

// Loading spinner with text
interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ text, size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};

// Button with loading state
interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const LoadingButton = ({ loading, children, className, disabled, onClick }: LoadingButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors",
        "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{children}</span>
    </button>
  );
};

// Pulse animation wrapper
interface PulseWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
}

export const PulseWrapper = ({ children, isLoading, className }: PulseWrapperProps) => {
  return (
    <div className={cn(isLoading && "animate-pulse", className)}>
      {children}
    </div>
  );
};