"use client";

import * as React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useHotkeys } from "react-hotkeys-hook";
import { MagnifyingGlassIcon, StarIcon, ClockIcon, HeartIcon } from "@radix-ui/react-icons";

const recentSearches = [
    "MacBook Air M2",
    "Engineering textbooks",
    "Gaming chair",
    "iPhone 14"
];

const trendingItems = [
    { name: "MacBook Pro 16\"", price: "₹1,85,000", category: "Electronics" },
    { name: "Complete CSE Books Set", price: "₹3,200", category: "Books" },
    { name: "Gaming Setup", price: "₹45,000", category: "Electronics" },
    { name: "Study Table", price: "₹4,500", category: "Furniture" }
];

export function SearchPopover() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");

    // Toggle with Ctrl+K (or Cmd+K on Mac)
    useHotkeys("ctrl+k, cmd+k", (e) => {
        e.preventDefault();
        setOpen((prev) => !prev);
    });

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group relative flex items-center gap-3 w-full sm:w-auto min-w-[200px] lg:min-w-[280px] px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-gray-200 dark:border-gray-700"
            >
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors flex-1 text-left">
                    Search items, categories...
                </span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded border border-gray-300 dark:border-gray-600">
                    ⌘K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <CommandInput 
                        placeholder="Search for textbooks, electronics, furniture, and more..." 
                        className="pl-12 text-base h-14 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none focus:ring-0"
                        value={query}
                        onValueChange={setQuery}
                    />
                </div>
                
                <CommandList className="max-h-[70vh] p-4">
                    <CommandEmpty>
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Try searching for "textbooks", "laptop", or "furniture"
                            </p>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                Browse All Categories
                            </button>
                        </div>
                    </CommandEmpty>

                    {!query && (
                        <>
                            {/* Recent Searches */}
                            <CommandGroup heading="Recent Searches">
                                {recentSearches.map((search, index) => (
                                    <CommandItem key={index} className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <ClockIcon className="w-4 h-4 text-gray-400" />
                                        <span className="flex-1">{search}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>

                            {/* Trending Items */}
                            <CommandGroup heading="Trending Items">
                                {trendingItems.map((item, index) => (
                                    <CommandItem key={index} className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {item.category === 'Electronics' ? '💻' : item.category === 'Books' ? '📚' : '🪑'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.category} • {item.price}</p>
                                        </div>
                                        <StarIcon className="w-4 h-4 text-yellow-400" />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}

                    {/* Categories */}
                    <CommandGroup heading="Popular Categories">
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                📚
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Textbooks & Study Materials</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">285+ items</p>
                            </div>
                        </CommandItem>
                        
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                💻
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Electronics & Gadgets</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">156+ items</p>
                            </div>
                        </CommandItem>
                        
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                🪑
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Furniture & Dorm Items</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">98+ items</p>
                            </div>
                        </CommandItem>
                        
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                                👕
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Clothing & Accessories</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">234+ items</p>
                            </div>
                        </CommandItem>
                        
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                🚲
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Bicycles & Transport</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">67+ items</p>
                            </div>
                        </CommandItem>
                    </CommandGroup>

                    {/* Quick Actions */}
                    <CommandGroup heading="Quick Actions">
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">+</span>
                            </div>
                            <span className="font-medium">Sell an Item</span>
                        </CommandItem>
                        
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <HeartIcon className="w-4 h-4 text-red-500" />
                            </div>
                            <span className="font-medium">Saved Items</span>
                        </CommandItem>
                        
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                💬
                            </div>
                            <span className="font-medium">Messages</span>
                        </CommandItem>
                    </CommandGroup>

                    {/* Quick Filters */}
                    <CommandGroup heading="Quick Filters">
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <span className="text-lg">🔥</span>
                            <span>Items under ₹1,000</span>
                        </CommandItem>
                        
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <span className="text-lg">⚡</span>
                            <span>Posted today</span>
                        </CommandItem>
                        
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <span className="text-lg">📍</span>
                            <span>Near my location</span>
                        </CommandItem>
                        
                        <CommandItem className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <span className="text-lg">⭐</span>
                            <span>Highly rated sellers</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
