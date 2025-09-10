import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon, GridIcon, ListBulletIcon } from "@radix-ui/react-icons";

const categories = [
    { 
        id: 1,
        name: "Textbooks & Study Materials", 
        icon: "📚",
        count: 285,
        description: "Course books, notes, and study guides"
    },
    { 
        id: 2,
        name: "Electronics & Gadgets", 
        icon: "💻",
        count: 156,
        description: "Laptops, phones, accessories"
    },
    { 
        id: 3,
        name: "Furniture & Dorm", 
        icon: "🪑",
        count: 98,
        description: "Desks, chairs, storage solutions"
    },
    { 
        id: 4,
        name: "Fashion & Apparel", 
        icon: "👕",
        count: 234,
        description: "Clothing, shoes, accessories"
    },
    { 
        id: 5,
        name: "Bikes & Transport", 
        icon: "🚲",
        count: 67,
        description: "Bicycles, scooters, transport"
    },
    { 
        id: 6,
        name: "Lab & Supplies", 
        icon: "🔬",
        count: 89,
        description: "Lab equipment, supplies, tools"
    },
    { 
        id: 7,
        name: "Gaming & Entertainment", 
        icon: "🎮",
        count: 45,
        description: "Games, consoles, entertainment"
    },
    { 
        id: 8,
        name: "Home & Kitchen", 
        icon: "🏠",
        count: 78,
        description: "Kitchen items, home decor"
    }
];

export default function Categories() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                            Browse Categories
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Find exactly what you need from fellow KIST students
                    </p>
                </div>

                {/* Search and Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            onClick={() => setViewMode('grid')}
                            className="px-4 py-3"
                        >
                            <GridIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            onClick={() => setViewMode('list')}
                            className="px-4 py-3"
                        >
                            <ListBulletIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Categories Grid/List */}
                <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                    {filteredCategories.map((category) => (
                        <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                            <CardContent className={viewMode === 'grid' ? "p-6 text-center" : "p-4 flex items-center gap-4"}>
                                <div className={`${viewMode === 'grid' ? 'mb-4' : ''}`}>
                                    <div className={`${viewMode === 'grid' ? 'w-16 h-16 mx-auto' : 'w-12 h-12'} bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-2xl">{category.icon}</span>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className={`font-bold text-gray-900 dark:text-white ${viewMode === 'grid' ? 'text-lg mb-2' : 'text-base mb-1'}`}>
                                        {category.name}
                                    </h3>
                                    <p className={`text-gray-600 dark:text-gray-400 ${viewMode === 'grid' ? 'text-sm mb-3' : 'text-xs mb-2'}`}>
                                        {category.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {category.count} items
                                        </span>
                                        {viewMode === 'list' && (
                                            <Button size="sm" variant="outline">
                                                Browse
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No categories found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search terms
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}