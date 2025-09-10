import React, { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactSellerProps {
    sellerName: string;
    sellerAvatar?: string;
    itemTitle: string;
    itemPrice: string;
    itemImage?: string;
}

export const ContactSeller: React.FC<ContactSellerProps> = ({
    sellerName,
    sellerAvatar,
    itemTitle,
    itemPrice,
    itemImage
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isSent, setIsSent] = useState(false);

    const handleSendMessage = () => {
        if (message.trim()) {
            // In a real app, this would send the message to the backend
            console.log("Sending message to", sellerName, ":", message);
            setIsSent(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSent(false);
                setMessage("");
            }, 2000);
        }
    };

    const quickMessages = [
        "Is this item still available?",
        "Can we meet on campus to see this?",
        "What's the condition of this item?",
        "Is the price negotiable?",
        "When are you free to meet?"
    ];

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
                <MessageCircle className="h-4 w-4" />
                Contact Seller
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg">Contact Seller</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Item Info */}
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        {itemImage && (
                            <img
                                src={itemImage}
                                alt={itemTitle}
                                className="w-12 h-12 rounded object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm">{itemTitle}</h3>
                            <p className="text-green-600 font-bold">{itemPrice}</p>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center gap-3">
                        {sellerAvatar ? (
                            <img
                                src={sellerAvatar}
                                alt={sellerName}
                                className="w-10 h-10 rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                {sellerName.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="font-semibold">{sellerName}</p>
                            <p className="text-sm text-muted-foreground">Seller</p>
                        </div>
                    </div>

                    {!isSent ? (
                        <>
                            {/* Quick Messages */}
                            <div>
                                <p className="text-sm font-medium mb-2">Quick messages:</p>
                                <div className="space-y-2">
                                    {quickMessages.map((quickMsg, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setMessage(quickMsg)}
                                            className="w-full text-left p-2 text-sm bg-muted/30 hover:bg-muted/50 rounded transition-colors"
                                        >
                                            {quickMsg}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Message */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Or write your own message:
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Hi! I'm interested in your item..."
                                    className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>

                            {/* Send Button */}
                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                            </Button>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Message Sent!</h3>
                            <p className="text-muted-foreground text-sm">
                                {sellerName} will receive your message and can reply to you directly.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};