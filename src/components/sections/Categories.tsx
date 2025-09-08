// src/components/sections/CategoriesSection.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { type Category } from "@/types";
import { motion } from "framer-motion";
import { AnimatedSection } from "../motion/AnimatedSection";

const categoriesData: Category[] = [
    { icon: "📚", name: "Textbooks", count: 128 },
    { icon: "💻", name: "Electronics", count: 94 },
    { icon: "🪑", name: "Dorm Gear", count: 67 },
    { icon: "🚲", name: "Bikes", count: 34 },
    { icon: "👕", name: "Apparel", count: 142 },
    { icon: "🔬", name: "Lab Supplies", count: 53 },
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

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export const CategoriesSection = () => {
    return (
        <AnimatedSection className="pt-40 pb-20 container mx-auto px-6 text-center">
            {/* Section Title */}
            <h2 className="text-3xl font-bold mb-12 tracking-tight text-foreground md:text-4xl lg:text-5xl">
                Trending Categories
            </h2>

            {/* Categories Grid */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {categoriesData.map((category) => (
                    <motion.div key={category.name} variants={itemVariants}>
                        <Card className="group h-44 flex flex-col items-center justify-center 0 border border-blue-100 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/50 cursor-pointer">
                            <CardContent className="flex flex-col items-center justify-center gap-3">
                                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                                    {category.icon}
                                </span>
                                <p className="font-semibold text-center">
                                    {category.name}
                                </p>
                                <p className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                    {category.count} Items
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </AnimatedSection>
    );
};
