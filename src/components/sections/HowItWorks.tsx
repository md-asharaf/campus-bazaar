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
            "group relative w-full rounded-lg border bg-card p-6 transition-all cursor-pointer duration-300 hover:border-primary/60 hover:shadow-lg hover:scale-105",
            className,
        )}
    >
        {/* Decorative Line - Visible on larger screens */}
        <div className="absolute -left-[1px] top-1/2 hidden h-1/2 w-px -translate-y-1/2 bg-border transition-colors group-hover:bg-primary/60 md:block" />
        <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-border transition-colors group-hover:bg-primary/60 md:hidden" />

        {/* Icon Container */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg duration-300 border bg-background text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex flex-col">
            <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>

            {/* Benefits List */}
            <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <div className="flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {benefit}
                        </span>
                    </li>
                ))}
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
        title: "Connect & Negotiate",
        description:
            "Buyers can message sellers directly to ask questions, negotiate prices, and arrange safe meetups on campus.",
        benefits: [
            "In-app messaging system",
            "Safe campus meetup suggestions",
            "Price negotiation tools",
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
        <AnimatedSection className="w-full bg-background py-12 md:py-20">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                        How Students Sell & Buy
                    </h2>
                    <p className="mb-8 text-base text-muted-foreground max-w-2xl mx-auto">
                        Our platform makes it easy for students to sell their
                        used products and find great deals from fellow students.
                        Join thousands of students already using our
                        marketplace.
                    </p>
                    <Button
                        size="lg"
                        className="hover:scale-110 duration-300 transition-all cursor-pointer"
                    >
                        Start Selling
                        <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>

                {/* Step Indicators with Connecting Line */}
                <div className="relative mx-auto mb-12 w-full max-w-6xl">
                    <div
                        aria-hidden="true"
                        className="absolute left-[12.5%] top-1/2 h-0.5 w-[75%] -translate-y-1/2 bg-border hidden md:block"
                    ></div>
                    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
                        {items.map((_, index) => (
                            <div
                                key={index}
                                className="flex h-8 w-8 items-center justify-center justify-self-center rounded-full bg-primary text-primary-foreground font-semibold ring-4 ring-background"
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Process Cards Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {items.map((item, index) => (
                        <ProcessCard key={index} {...item} />
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};
