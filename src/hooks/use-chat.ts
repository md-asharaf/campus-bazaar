import { useContext } from 'react';
import { ChatContext } from '@/contexts/chat-provider';

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}