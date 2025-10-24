import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, X, Image as ImageIcon } from "lucide-react";
import { Input } from "../ui/input";
import { chatService } from "@/services/chat.service";
import { handleApiResponse } from "@/utils/apiHelpers";
import { MessageInputLoadingOverlay, ImageUploadLoading } from "@/components/ui/loading-states";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage?: (message: string) => void; // Made optional for context mode
  onTyping?: () => void; // Made optional for context mode
  disabled?: boolean;
  chatId: string;
  useContext?: boolean; // Whether to use chat context
}

const MessageInput = ({
  onSendMessage,
  onTyping,
  disabled = false,
  chatId,
  useContext = true
}: MessageInputProps) => {
  // Always call useChat but handle the case where context is not available
  let chatContext = null;
  try {
    const { useChat } = require("@/hooks/useChat");
    chatContext = useChat();
  } catch (error) {
    // Context not available, will use local state instead
    chatContext = null;
  }

  // Only use context if useContext prop is true
  const shouldUseContext = useContext && chatContext;

  // Safely destructure from context
  const state = shouldUseContext ? chatContext?.state : null;
  const contextSendMessage = shouldUseContext ? chatContext?.sendMessage : null;
  const setMessageInput = shouldUseContext ? chatContext?.setMessageInput : null;
  const contextSetSelectedImages = shouldUseContext ? chatContext?.setSelectedImages : null;
  const clearSelectedImages = shouldUseContext ? chatContext?.clearSelectedImages : null;
  const startTyping = shouldUseContext ? chatContext?.startTyping : null;
  const stopTyping = shouldUseContext ? chatContext?.stopTyping : null;

  // Use context state if available, otherwise local state
  const [localMessage, setLocalMessage] = useState("");
  const [localSelectedImages, setLocalSelectedImages] = useState<File[]>([]);
  const [localImagePreviews, setLocalImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get values from context or local state
  const message = shouldUseContext && state ? state.messageInputValue : localMessage;
  const selectedImages = shouldUseContext && state ? state.selectedImages : localSelectedImages;
  const imagePreviews = useContext && state ? state.imagePreviews : localImagePreviews;
  const isConnected = useContext && state ? state.isConnected : true;
  const isSendingMessage = useContext && state ? state.loadingStates?.sendingMessage : false;

  // Typing indicator logic
  const handleTypingStart = useCallback(() => {
    if (useContext && isConnected && startTyping) {
      startTyping();
    } else if (onTyping) {
      onTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (useContext && isConnected && stopTyping) {
        stopTyping();
      }
    }, 3000);
  }, [useContext, isConnected, startTyping, stopTyping, onTyping]);

  const handleTypingStop = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (useContext && isConnected && stopTyping) {
      stopTyping();
    }
  }, [useContext, isConnected, stopTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validImages = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file.`);
        return false;
      }
      return true;
    });

    if (validImages.length === 0) return;

    const newImages = [...selectedImages, ...validImages];
    const newPreviews = [...imagePreviews];

    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newImages.length) {
          if (shouldUseContext && contextSetSelectedImages) {
            contextSetSelectedImages(newImages, newPreviews);
          } else {
            setLocalSelectedImages(newImages);
            setLocalImagePreviews(newPreviews);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_: any, i: number) => i !== index);
    const newPreviews = imagePreviews.filter((_: any, i: number) => i !== index);

    if (shouldUseContext && clearSelectedImages) {
      contextSetSelectedImages(newImages, newPreviews);
    } else {
      setLocalSelectedImages(newImages);
      setLocalImagePreviews(newPreviews);
    }

    if (fileInputRef.current && newImages.length === 0) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && selectedImages.length === 0) return;
    if (disabled || uploading || isSendingMessage || !isConnected) return;

    // Stop typing indicator
    handleTypingStop();

    setUploading(true);

    try {
      if (shouldUseContext && contextSendMessage) {
        // Use context for sending messages
        await contextSendMessage(message, selectedImages.length > 0 ? selectedImages : undefined);
      } else {
        // Fallback to traditional method
        if (selectedImages.length > 0) {
          const response = await chatService.sendImageMessage(chatId, message, selectedImages);
          handleApiResponse(response);

          setLocalMessage("");
          setLocalSelectedImages([]);
          setLocalImagePreviews([]);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else if (onSendMessage) {
          onSendMessage(message);
          setLocalMessage("");
        }
      }

      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (shouldUseContext && setMessageInput) {
      setMessageInput(value);
    } else {
      setLocalMessage(value);
    }

    handleTypingStart();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      // Clear input on Escape
      if (useContext && setMessageInput && clearSelectedImages) {
        setMessageInput("");
        clearSelectedImages();
      } else {
        setLocalMessage("");
        setLocalSelectedImages([]);
        setLocalImagePreviews([]);
      }
    } else {
      handleTypingStart();
    }
  };

  // Focus management
  useEffect(() => {
    if (inputRef.current && !disabled && isConnected) {
      inputRef.current.focus();
    }
  }, [disabled, isConnected]);

  const isInputDisabled = disabled || uploading || isSendingMessage || !isConnected;
  const canSend = message.trim() || selectedImages.length > 0;

  return (
    <div className="relative">
      {/* Loading overlay */}
      {(isSendingMessage || uploading) && <MessageInputLoadingOverlay />}

      {/* Image upload loading indicator */}
      {selectedImages.length > 0 && uploading && (
        <div className="absolute -top-12 left-4 right-4 z-10">
          <ImageUploadLoading />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={cn(
          "p-4 border-t bg-background/60 backdrop-blur-md sticky bottom-0",
          "transition-all duration-200",
          !isConnected && "bg-red-50/80 border-red-200"
        )}
      >
        {/* Connection status indicator */}
        {!isConnected && (
          <div className="mb-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md text-center">
            Disconnected - Messages will be sent when reconnected
          </div>
        )}

        {imagePreviews.length > 0 && (
          <div className="px-4 pt-3 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imagePreviews.map((preview: string, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "relative inline-block shrink-0 rounded-lg overflow-hidden border border-border",
                    "transition-all duration-200",
                    (uploading || isSendingMessage) && "opacity-50"
                  )}
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80 hover:bg-background"
                    disabled={isInputDisabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-background/80 text-[10px] font-medium">
                    {index + 1}/{imagePreviews.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 shrink-0 transition-colors",
              selectedImages.length > 0 && "text-blue-600 bg-blue-50"
            )}
            onClick={() => fileInputRef.current?.click()}
            disabled={isInputDisabled}
            title="Attach images"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>

          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onBlur={handleTypingStop}
              placeholder={
                !isConnected
                  ? "Disconnected..."
                  : isSendingMessage || uploading
                    ? "Sending..."
                    : selectedImages.length > 0
                      ? `${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} selected...`
                      : "Type your message..."
              }
              disabled={isInputDisabled}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border text-sm placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "shadow-sm transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isConnected
                  ? "border-border bg-white/80 dark:bg-gray-800/80"
                  : "border-red-200 bg-red-50/80"
              )}
            />
            <div className="absolute inset-0 rounded-xl border border-transparent group-focus-within:border-blue-400/40 transition-all duration-300 pointer-events-none"></div>
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={!canSend || isInputDisabled}
            className={cn(
              "h-10 w-10 shrink-0 rounded-full shadow-lg",
              "bg-linear-to-r from-primary to-blue-600",
              "hover:from-primary/90 hover:to-blue-600/90",
              "transition-all duration-200",
              canSend && isConnected ? "opacity-100" : "opacity-50"
            )}
          >
            {(isSendingMessage || uploading) ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
