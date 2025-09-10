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

function AppContent() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="bg-background text-foreground font-sans overflow-x-hidden min-h-screen flex flex-col">
            {/* Only show header on non-home pages */}
            {!isHomePage && <Header />}
            
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            
            <Footer />
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
