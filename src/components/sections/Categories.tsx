"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type Category } from "@/types";
import { motion } from "framer-motion";
import { AnimatedSection } from "../motion/AnimatedSection";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const categoriesData: Category[] = [
    { 
        icon: "📚", 
        name: "Textbooks & Study Materials", 
        count: 285,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
    },
    { 
        icon: "💻", 
        name: "Electronics & Gadgets", 
        count: 156,
        gradient: "from-purple-500 to-pink-500",
        bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
    },
    { 
        icon: "🪑", 
        name: "Furniture & Dorm", 
        count: 98,
        gradient: "from-green-500 to-emerald-500",
        bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
    },
    { 
        icon: "🚲", 
        name: "Bikes & Transport", 
        count: 67,
        gradient: "from-orange-500 to-red-500",
        bgGradient: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
    },
    { 
        icon: "👕", 
        name: "Fashion & Apparel", 
        count: 234,
        gradient: "from-pink-500 to-rose-500",
        bgGradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20"
    },
    { 
        icon: "🔬", 
        name: "Lab & Supplies", 
        count: 89,
        gradient: "from-indigo-500 to-blue-500",
        bgGradient: "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20"
    },
    { 
        icon: "🎮", 
        name: "Gaming & Entertainment", 
        count: 45,
        gradient: "from-violet-500 to-purple-500",
        bgGradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20"
    },
    { 
        icon: "🏠", 
        name: "Home & Kitchen", 
        count: 78,
        gradient: "from-teal-500 to-green-500",
        bgGradient: "from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
};

export const CategoriesSection = () => {
    return (
        <section className="py-20 sm:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-6">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Popular Categories</span>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                            Shop by Category
                        </span>
                    </h2>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Find exactly what you need from thousands of items posted by fellow KIST students
                    </p>
                </div>

                {/* Categories Grid */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {categoriesData.map((category, index) => (
                        <motion.div key={category.name} variants={itemVariants}>
                            <Card className={`group relative overflow-hidden bg-gradient-to-br ${category.bgGradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer h-40 sm:h-48`}>
                                <CardContent className="relative h-full flex flex-col items-center justify-center p-4 sm:p-6">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-gradient-to-br from-white to-transparent"></div>
                                        <div className="absolute bottom-2 left-2 w-12 h-12 rounded-full bg-gradient-to-br from-white to-transparent"></div>
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className="relative mb-3 sm:mb-4">
                                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                            <span className="text-2xl sm:text-3xl filter drop-shadow-sm">
                                                {category.icon}
                                            </span>
                                        </div>
                                        
                                        {/* Floating badge */}
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-xs font-bold text-white">{index + 1}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="text-center relative z-10">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-2 leading-tight">
                                            {category.name}
                                        </h3>
                                        <div className="flex items-center justify-center gap-2">
                                            <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {category.count.toLocaleString()} items
                                            </p>
                                            <ArrowRightIcon className="w-3 h-3 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                    
                                    {/* Hover overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">1,200+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Listings</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">25+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">800+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">KIST Students</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">₹85K+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Money Saved</div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                        <span className="flex items-center gap-2">
                            Explore All Categories
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};
