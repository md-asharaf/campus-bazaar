import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { type Listing } from "@/types";
import { AnimatedSection } from "../motion/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ContactSeller } from "../messaging/ContactSeller";
import { RainbowImageGallery } from "../ui/RainbowImageGallery";
import { HeartIcon, EyeOpenIcon, ClockIcon, StarIcon } from "@radix-ui/react-icons";

interface ExtendedListing extends Listing {
    sellerName: string;
    sellerAvatar?: string;
    images: string[];
    condition: string;
    timePosted: string;
    views: number;
    likes: number;
    rating: number;
    isVerified: boolean;
    category: string;
}

const listingsData: ExtendedListing[] = [
    {
        id: 1,
        title: "MacBook Air M2 (2022) - Excellent Condition",
        price: "₹85,000",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"
        ],
        sellerName: "Arjun Mehta",
        sellerAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        condition: "Like New",
        timePosted: "2 hours ago",
        views: 124,
        likes: 18,
        rating: 4.9,
        isVerified: true,
        category: "Electronics"
    },
    {
        id: 2,
        title: "Complete Engineering Textbook Set (4th Sem)",
        price: "₹2,800",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80"
        ],
        sellerName: "Priya Sharma",
        sellerAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
        condition: "Good",
        timePosted: "5 hours ago",
        views: 89,
        likes: 12,
        rating: 4.7,
        isVerified: true,
        category: "Books"
    },
    {
        id: 3,
        title: "Gaming Chair - RGB LED, Ergonomic",
        price: "₹12,500",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1541558869434-2840d308329a?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
        ],
        sellerName: "Rohit Singh",
        sellerAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
        condition: "Excellent",
        timePosted: "1 day ago",
        views: 156,
        likes: 24,
        rating: 4.8,
        isVerified: false,
        category: "Furniture"
    },
    {
        id: 4,
        title: "iPhone 14 Pro - 128GB Space Black",
        price: "₹95,000",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
        ],
        sellerName: "Sneha Patel",
        sellerAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
        condition: "Like New",
        timePosted: "3 hours ago",
        views: 203,
        likes: 31,
        rating: 5.0,
        isVerified: true,
        category: "Electronics"
    },
    {
        id: 5,
        title: "Study Desk with Storage - Wooden",
        price: "₹4,200",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
        ],
        sellerName: "Karan Joshi",
        sellerAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
        condition: "Good",
        timePosted: "6 hours ago",
        views: 67,
        likes: 8,
        rating: 4.5,
        isVerified: true,
        category: "Furniture"
    },
    {
        id: 6,
        title: "Mechanical Keyboard - Cherry MX Blue",
        price: "₹3,800",
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
        ],
        sellerName: "Ananya Roy",
        sellerAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
        condition: "Excellent",
        timePosted: "4 hours ago",
        views: 92,
        likes: 15,
        rating: 4.6,
        isVerified: false,
        category: "Electronics"
    }
];

export const FeaturedListingsSection = () => {
    const [selectedItem, setSelectedItem] = useState<ExtendedListing | null>(null);
    const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

    const handleLike = (itemId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setLikedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    return (
        <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-6">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Trending Now</span>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                            Hot Deals
                        </span>
                        <br />
                        <span className="text-gray-600 dark:text-gray-400 text-3xl sm:text-4xl lg:text-5xl">
                            from KIST
                        </span>
                    </h2>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Discover amazing deals from verified KIST students. From tech gadgets to textbooks, 
                        find everything you need at student-friendly prices.
                    </p>
                </div>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    {listingsData.map((item, index) => (
                        <div
                            key={item.id}
                            className={`group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700 ${
                                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                            }`}
                            onClick={() => setSelectedItem(item)}
                        >
                            {/* Image Container */}
                            <div className={`relative overflow-hidden ${index === 0 ? 'h-80 lg:h-96' : 'h-64'}`}>
                                <RainbowImageGallery
                                    images={item.images}
                                    title={item.title}
                                />
                                
                                {/* Overlays */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                                        {item.category}
                                    </span>
                                    {item.isVerified && (
                                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>

                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={(e) => handleLike(item.id, e)}
                                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                                            likedItems.has(item.id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/80 text-gray-700 hover:bg-white'
                                        }`}
                                    >
                                        <HeartIcon className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white text-xs">
                                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                                        <EyeOpenIcon className="w-3 h-3" />
                                        <span>{item.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                                        <ClockIcon className="w-3 h-3" />
                                        <span>{item.timePosted}</span>
                                    </div>
                                </div>

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className={`font-bold text-gray-900 dark:text-white leading-tight ${
                                        index === 0 ? 'text-xl lg:text-2xl' : 'text-lg'
                                    }`}>
                                        {item.title}
                                    </h3>
                                </div>

                                {/* Seller Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src={item.sellerAvatar}
                                        alt={item.sellerName}
                                        className="w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-600"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.sellerName}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    {item.rating}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {item.condition}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`font-bold text-blue-600 dark:text-blue-400 ${
                                            index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                                        }`}>
                                            {item.price}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {item.likes} likes
                                        </p>
                                    </div>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(item);
                                        }}
                                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
                                    >
                                        Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 text-lg">
                        <span className="flex items-center gap-2">
                            🔍 Explore All Items
                            <span className="text-sm opacity-80">(1200+ available)</span>
                        </span>
                    </Button>
                </div>
            </div>

            {/* Contact Seller Modal */}
            {selectedItem && (
                <ContactSeller
                    sellerName={selectedItem.sellerName}
                    sellerAvatar={selectedItem.sellerAvatar}
                    itemTitle={selectedItem.title}
                    itemPrice={selectedItem.price}
                    itemImage={selectedItem.image}
                />
            )}
        </section>
    );
};
