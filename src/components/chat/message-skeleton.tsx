import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MessageSkeletonProps {
    isSent?: boolean;
}

const MessageSkeleton = ({ isSent = false }: MessageSkeletonProps) => {
    return (
        <div className={cn(
            "flex w-full mb-4 animate-pulse",
            isSent ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2.5",
                isSent
                    ? "bg-[hsl(var(--chat-sent))]/10 rounded-br-md"
                    : "bg-[hsl(var(--chat-received))]/10 rounded-bl-md"
            )}>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center justify-end mt-2 gap-1.5">
                    <Skeleton className="h-3 w-10" />
                    {isSent && <Skeleton className="h-4 w-4 rounded" />}
                </div>
            </div>
        </div>
    );
};



export default MessageSkeleton;