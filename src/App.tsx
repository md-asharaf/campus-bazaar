import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Messages from "./pages/Messages";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ChatContainer from "./components/chat/ChatContainer";
import type { Conversation } from "./types";
import ChatLayout from "./components/layout/ChatLayout";


const conversation: Conversation = {
    id: "xyz",
    participantId: "user123",
    participantName: "John Doe",
    participantAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Is this item still available?",
    lastMessageTime: new Date("2024-01-15T10:30:00Z"),
    unreadCount: 2,
    itemTitle: "MacBook Pro 13-inch",
    itemPrice: "$999",
    itemImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=300&h=300&fit=crop"
};


function AppContent() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isChatPage = location.pathname.startsWith('/chat');

    const showHeaderFooter = !isHomePage && !isChatPage;

    return (
        <div className="bg-background text-foreground font-sans overflow-x-hidden min-h-screen flex flex-col">
            {showHeaderFooter && <Header />}

            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/about" element={<About />} />
                    <Route
                        path="/chat/:chatId"
                        element={
                            <ChatLayout>
                                <ChatContainer conversation={conversation} />
                            </ChatLayout>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>

            {showHeaderFooter && <Footer />}
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}
