import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, X, Image as ImageIcon } from "lucide-react";
import { Input } from "../ui/input";
import chatService from "@/services/chat-service";

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    onTyping: () => void;
    disabled?: boolean;
    chatId: string;
}

const MessageInput = ({ onSendMessage, onTyping, disabled = false, chatId }: MessageInputProps) => {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                    setImagePreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });

        setSelectedImages(newImages);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setSelectedImages(newImages);
        setImagePreviews(newPreviews);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim() && selectedImages.length === 0) return;
        if (disabled || uploading) return;

        setUploading(true);

        try {
            if (selectedImages.length > 0) {
                // Send images via HTTP request
                for (const image of selectedImages) {
                    await chatService.sendImageMessage(image, message, chatId);
                }

                setMessage("");
                setSelectedImages([]);
                setImagePreviews([]);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {

                onSendMessage(message);
                setMessage("");
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
            {imagePreviews.length > 0 && (
                <div className="px-4 pt-3 pb-2">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {imagePreviews.map((preview, index) => (
                            <div
                                key={index}
                                className="relative inline-block shrink-0 rounded-lg overflow-hidden border border-border"
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
                                    disabled={uploading}
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
                    className="h-9 w-9 shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || disabled}
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
                        placeholder={
                            uploading
                                ? "Uploading..."
                                : disabled
                                    ? "Connecting..."
                                    : selectedImages.length > 0
                                        ? `${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} selected...`
                                        : "Type your message..."
                        }
                        disabled={disabled || uploading}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-white/80 dark:bg-gray-800/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute inset-0 rounded-xl border border-transparent group-focus-within:border-blue-400/40 transition-all duration-300 pointer-events-none"></div>
                </div>

                <Button
                    type="submit"
                    size="icon"
                    disabled={(!message.trim() && selectedImages.length === 0) || uploading || disabled}
                    className="h-10 w-10 shrink-0 rounded-full bg-linear-to-r from-primary to-[hsl(var(--primary-glow))] hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                >
                    {uploading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </form>
    );
};

export default MessageInput;
