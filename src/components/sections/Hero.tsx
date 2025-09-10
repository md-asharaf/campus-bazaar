"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { AuthManager } from "../auth/AuthManager";

export const HeroSection = () => {
    const [showAuth, setShowAuth] = useState(false);
    const [currentStat, setCurrentStat] = useState(0);
    const { user } = useAuth();

    const stats = [
        { value: "800+", label: "KIST Students", icon: "👥" },
        { value: "3,500+", label: "Items Sold", icon: "📦" },
        { value: "₹85K+", label: "Money Saved", icon: "💰" },
        { value: "25+", label: "Categories", icon: "🏷️" }
    ];

    // Rotate stats every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStat((prev) => (prev + 1) % stats.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [stats.length]);

    return (
        <main className="relative flex items-center justify-center min-h-screen z-20 px-4 sm:px-6 lg:px-8 pt-20">
            <div className="text-center max-w-6xl mx-auto">
                {/* Announcement Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 mb-8 group hover:scale-105 transition-all duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/90 text-sm font-medium">
                        🎓 Exclusive to KIST College Students
                    </span>
                    <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight text-white mb-8 relative">
                    <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                        KIST Student
                    </span>
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative">
                        Marketplace
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-8 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-80 animate-bounce delay-300 hidden sm:block"></div>
                        <div className="absolute -bottom-2 -left-6 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-60 animate-pulse delay-700 hidden sm:block"></div>
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/80 mb-4 leading-relaxed max-w-4xl mx-auto">
                    Buy, sell, and discover amazing deals from fellow KIST students
                </p>
                <p className="text-base sm:text-lg text-white/60 mb-12 max-w-2xl mx-auto">
                    Connect with your KIST community to save money on textbooks, electronics, furniture, and more. 
                    <span className="text-blue-300 font-medium"> Trusted. Secure. KIST-verified.</span>
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
                    <button className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative flex items-center gap-2 text-lg">
                            🛍️ Start Shopping
                        </span>
                    </button>
                    
                    {user ? (
                        <button className="group w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95">
                            <span className="flex items-center gap-2 text-lg">
                                📱 Sell Your Items
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowAuth(true)}
                            className="group w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <span className="flex items-center gap-2 text-lg">
                                🚀 Join Free
                            </span>
                        </button>
                    )}
                </div>

                {/* Animated Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 ${
                                index === currentStat ? 'ring-2 ring-blue-400/50 bg-white/10' : ''
                            }`}
                        >
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-white/70 font-medium">
                                {stat.label}
                            </div>
                            
                            {/* Animated border */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/60">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Student Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                        <span className="text-sm font-medium">Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                        <span className="text-sm font-medium">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-700"></div>
                        <span className="text-sm font-medium">Free to Join</span>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Auth Manager */}
            <AuthManager
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
            />
        </main>
    );
};
