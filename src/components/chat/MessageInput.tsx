import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "../ui/input";

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    onTyping: () => void;
    disabled?: boolean;
}

const MessageInput = ({ onSendMessage, onTyping, disabled = false }: MessageInputProps) => {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage("");
            inputRef.current?.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        onTyping();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        } else {

            onTyping();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 border-t bg-background/60 backdrop-blur-md sticky bottom-0"
        >
            <div className="flex items-center gap-2">

                <div className="relative flex-1">
                    <Input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder={disabled ? "Connecting..." : "Type your message..."}
                        // disabled={disabled}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-white/80 dark:bg-gray-800/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute inset-0 rounded-xl border border-transparent group-focus-within:border-blue-400/40 transition-all duration-300 pointer-events-none"></div>
                </div>

                <Button
                    type="submit"
                    // disabled={!message.trim() || disabled}
                    className="p-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
            </div>
        </form>

    );
};

export default MessageInput;
