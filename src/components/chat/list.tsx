import { useNavigate } from "react-router-dom";
import { MessageSquarePlus, ArrowLeft, Search, MoreVertical, Edit } from "lucide-react";
import ChatItem from "./item";
import type { Conversation } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { filterConversations, sortConversationsByLatestMessage, getUserInitials } from "@/utils/chat-helpers";
import { createQueryFn } from "@/utils/api-helpers";


const ChatList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { data: conversations = [], isLoading, isError, error, refetch } = useQuery<Conversation[]>({
    queryKey: ['chats', user?.id],
    queryFn: createQueryFn(() => chatService.getMyChats()),
  });

  // Sort and filter conversations
  const sortedConversations = sortConversationsByLatestMessage(conversations);
  const filteredConversations = filterConversations(sortedConversations, searchQuery);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background animate-in fade-in duration-300">
        {/* Header skeleton */}
        <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Search skeleton */}
        <div className="p-4 border-b">
          <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
        </div>

        {/* Chat items skeleton */}
        <div className="flex-1 overflow-y-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 border-b animate-pulse">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-12"></div>
                </div>
                <div className="h-3 bg-muted rounded w-48"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-screen bg-background animate-in fade-in duration-300">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquarePlus className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6">{error.message}</p>
            <Button onClick={() => refetch()} className="w-full hover:scale-105 transition-transform">
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:max-w-4xl h-full mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-muted hover:scale-110 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getUserInitials(user?.name) || 'ME'}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-lg font-semibold text-foreground">Messages</h1>
            <p className="text-xs text-muted-foreground">
              {sortedConversations?.length || 0} conversation{(sortedConversations?.length || 0) !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted hover:scale-110 transition-all duration-200">
            <Edit className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted hover:scale-110 transition-all duration-200">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b bg-background/95 backdrop-blur-sm animate-in slide-in-from-top duration-300 delay-100">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-10 bg-muted/50 border-0 focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {(filteredConversations?.length || 0) > 0 ? (
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation, index) => (
              <div
                key={conversation.id}
                className="hover:bg-muted/30 active:bg-muted/50 transition-all cursor-pointer animate-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/chat/${conversation.id}`, {
                  state: { otherUser: conversation.otherUser }
                })}
              >
                <ChatItem conversation={conversation} onClick={() => { }} />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          // No search results
          <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          // No conversations
          <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-700 delay-200">
              <MessageSquarePlus className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 animate-in slide-in-from-bottom duration-500 delay-300">Start a conversation</h3>
            <p className="text-muted-foreground mb-6 max-w-sm animate-in slide-in-from-bottom duration-500 delay-400">
              Connect with other users and start meaningful conversations. Your messages will appear here.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="px-6 hover:scale-105 transition-transform animate-in slide-in-from-bottom duration-500 delay-500"
            >
              Explore Campus Bazaar
            </Button>
          </div>
        )}
      </div>

      {/* New Chat FAB (Floating Action Button) */}
      {(sortedConversations?.length || 0) > 0 && (
        <div className="absolute bottom-6 right-6 animate-in slide-in-from-bottom duration-500 delay-300">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
            onClick={() => navigate('/')}
          >
            <Edit className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatList;