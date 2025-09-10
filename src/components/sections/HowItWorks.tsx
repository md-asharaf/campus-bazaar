"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    ArrowUpRight,
    Upload,
    Search,
    MessageCircle,
    ShoppingCart,
} from "lucide-react";
import { AnimatedSection } from "../motion/AnimatedSection";

// Utility function for cn (if not available)
function cnFallback(
    ...classes: (string | undefined | null | boolean)[]
): string {
    return classes.filter(Boolean).join(" ");
}

const cnUtil = typeof cn !== "undefined" ? cn : cnFallback;

// Interface for individual process card props
interface ProcessCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    benefits: string[];
    className?: string;
}

// Reusable Process Card Component
const ProcessCard: React.FC<ProcessCardProps> = ({
    icon: Icon,
    title,
    description,
    benefits,
    className,
}) => (
    <div
        className={cnUtil(
            "group relative w-full rounded-xl sm:rounded-lg border bg-card p-4 sm:p-6 transition-all cursor-pointer duration-300 hover:border-primary/60 hover:shadow-lg hover:scale-105 active:scale-95 touch-manipulation",
            className,
        )}
    >
        {/* Decorative Line - Visible on larger screens */}
        <div className="absolute -left-[1px] top-1/2 hidden h-1/2 w-px -translate-y-1/2 bg-border transition-colors group-hover:bg-primary/60 lg:block" />
        <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-border transition-colors group-hover:bg-primary/60 lg:hidden" />

        {/* Icon Container */}
        <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg duration-300 border bg-background text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        {/* Content */}
        <div className="flex flex-col">
            <h3 className="mb-2 text-base sm:text-lg font-semibold text-card-foreground">
                {title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{description}</p>

            {/* Benefits List */}
            <ul className="space-y-1.5 sm:space-y-2">
                {benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <div className="flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-xs text-muted-foreground leading-relaxed">
                            {benefit}
                        </span>
                    </li>
                ))}
                {benefits.length > 3 && (
                    <li className="text-xs text-primary font-medium pt-1">
                        +{benefits.length - 3} more features
                    </li>
                )}
            </ul>
        </div>
    </div>
);
const items = [
    {
        icon: Upload,
        title: "List Your Item",
        description:
            "Take photos and create a listing for your used textbooks, electronics, furniture, or any other items you want to sell.",
        benefits: [
            "Easy photo upload with mobile app",
            "Smart pricing suggestions",
            "Category templates for quick listing",
            "Automatic campus location detection",
        ],
    },
    {
        icon: Search,
        title: "Students Discover",
        description:
            "Other students on your campus can browse, search, and filter items by category, price, condition, and location.",
        benefits: [
            "Campus-specific search results",
            "Filter by price and condition",
            "Save favorite items for later",
            "Get notifications for new listings",
        ],
    },
    {
        icon: MessageCircle,
        title: "Chat & Negotiate",
        description:
            "Use our built-in messaging system to chat with sellers, ask questions, negotiate prices, and arrange safe campus meetups.",
        benefits: [
            "Real-time messaging system",
            "Safe campus meetup coordination",
            "Price negotiation chat",
            "Verified student profiles",
        ],
    },
    {
        icon: ShoppingCart,
        title: "Complete Transaction",
        description:
            "Meet safely on campus to inspect the item and complete the purchase with cash, Venmo, or other preferred payment methods.",
        benefits: [
            "Secure payment options",
            "Transaction history tracking",
            "Rating and review system",
            "Dispute resolution support",
        ],
    },
];

// Main Campus Marketplace How It Works Component
export const HowItWorksSection = () => {
    return (
        <AnimatedSection className="w-full bg-background py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Header Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="mb-4 text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                        How Students Sell & Buy
                    </h2>
                    <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Our platform makes it easy for students to sell their
                        used products and find great deals from fellow students.
                        Join thousands of students already using our
                        marketplace.
                    </p>
                    <Button
                        size="lg"
                        className="hover:scale-105 duration-300 transition-all cursor-pointer touch-manipulation px-6 sm:px-8 py-3 sm:py-4"
                    >
                        Start Selling
                        <ArrowUpRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>

                {/* Step Indicators with Connecting Line */}
                <div className="relative mx-auto mb-8 sm:mb-12 w-full max-w-6xl">
                    <div
                        aria-hidden="true"
                        className="absolute left-[12.5%] top-1/2 h-0.5 w-[75%] -translate-y-1/2 bg-border hidden lg:block"
                    ></div>
                    <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {items.map((_, index) => (
                            <div
                                key={index}
                                className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center justify-self-center rounded-full bg-primary text-primary-foreground font-semibold ring-2 sm:ring-4 ring-background text-sm sm:text-base"
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Process Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {items.map((item, index) => (
                        <ProcessCard key={index} {...item} />
                    ))}
                </div>

                {/* Mobile-specific additional info */}
                <div className="mt-12 sm:mt-16 text-center">
                    <div className="bg-blue-50 rounded-xl p-6 sm:p-8 max-w-4xl mx-auto">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                            🎓 Student Benefits
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
                            <div className="text-center">
                                <div className="font-semibold text-blue-600">Save 60%</div>
                                <div className="text-muted-foreground">On textbooks</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-green-600">Earn Extra</div>
                                <div className="text-muted-foreground">Sell unused items</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-purple-600">Safe Deals</div>
                                <div className="text-muted-foreground">Campus community</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};
