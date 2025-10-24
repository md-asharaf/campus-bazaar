import MessageSkeleton from "./MessageSkeleton";

export const MessageListSkeleton = () => {
    return (
        <div className="space-y-4 px-4 py-6">
            <MessageSkeleton isSent={false} />
            <MessageSkeleton isSent={true} />
            <MessageSkeleton isSent={false} />
            <MessageSkeleton isSent={true} />
            <MessageSkeleton isSent={false} />
        </div>
    );
};