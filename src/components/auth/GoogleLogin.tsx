import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

interface GoogleLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userData: any) => void;
}

export const GoogleLogin: React.FC<GoogleLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLogin = () => {
        setIsLoading(true);
        
        // Redirect to backend Google OAuth endpoint
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        window.location.href = `${backendUrl}/v1/auth/user/google`;
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleBackdropClick}
        >
            <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md transition-all duration-300 ${
                isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <Cross2Icon className="h-4 w-4" />
                </button>
                
                {/* Content */}
                <div className="p-8 text-center">
                    {/* Logo - same as header */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="bg-black text-white font-bold text-xl flex items-center justify-center rounded-lg px-3 py-2">
                            KIST
                        </div>
                        <span className="font-semibold text-xl text-gray-900 dark:text-white">
                            Bazaar
                        </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Sign in to KIST Bazaar
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Use your KIST Google account to continue
                    </p>

                    <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span>Continue with Google</span>
                            </div>
                        )}
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                        Only KIST students can access this platform
                    </p>
                </div>
            </div>
        </div>
    );
};