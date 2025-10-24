import { Card, CardContent } from "@/components/ui/card";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/api";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback data in case API fails
const fallbackCategories = [
    { id: "1", name: "Textbooks", imageId: "https://picsum.photos/seed/books/500/300" },
    { id: "2", name: "Electronics", imageId: "https://picsum.photos/seed/electronics/500/300" },
    { id: "3", name: "Furniture", imageId: "https://picsum.photos/seed/furniture/500/300" },
    { id: "4", name: "Notes & Supplies", imageId: "https://picsum.photos/seed/notes/500/300" },
    { id: "5", name: "Gaming", imageId: "https://picsum.photos/seed/gaming/500/300" },
    { id: "6", name: "Fashion", imageId: "https://picsum.photos/seed/fashion/500/300" },
    { id: "7", name: "Lab Coats & Tools", imageId: "https://picsum.photos/seed/lab/500/300" },
    { id: "8", name: "Other", imageId: "https://picsum.photos/seed/other/500/300" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants:Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
        },
    },
};

export const Categories = () => {
    const { data, isLoading, error } = useCategories();

    // Use API data if available, otherwise fallback to static data
    const categories = data?.categories && data.categories.length > 0 ?
        data.categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            imageId: `https://picsum.photos/seed/${cat.name.toLowerCase()}/500/300`
        })) :
        fallbackCategories;

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="container mx-auto px-4 py-8 sm:py-12 flex-1">
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                            Explore Categories
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                            Find what you need, from textbooks to electronics, all in one place.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden h-full">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <Skeleton className="aspect-video w-full" />
                                    <div className="p-4">
                                        <Skeleton className="h-6 w-3/4 mx-auto" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container mx-auto px-4 py-8 sm:py-12 flex-1">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                        Explore Categories
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                        Find what you need, from textbooks to electronics, all in one place.
                    </p>
                    {error && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            Using cached categories (API temporarily unavailable)
                        </p>
                    )}
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {categories.map((category) => (
                        <motion.div key={category.id} variants={itemVariants} whileHover={{ y: -5 }}>
                            <Link to={`/items?category=${category.name.toLowerCase().replace(/ & /g, "-")}`} className="block group">
                                <Card className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-primary/20 group-hover:shadow-lg group-hover:border-primary/50 p-0">
                                    <CardContent className="p-0 flex flex-col h-full">
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={category.imageId}
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <h2 className="p-4 text-lg font-semibold text-center grow flex items-center justify-center">
                                            {category.name}
                                        </h2>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};