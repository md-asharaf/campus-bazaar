// src/components/sections/FeaturedListingsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Listing } from "@/types";
import { AnimatedSection } from "../motion/AnimatedSection";
import { Button } from "@/components/ui/button";

const listingsData: Listing[] = [
    {
        id: 1,
        title: "Barely Used Mini-Fridge",
        price: "₹3,500",
        image: "https://images.unsplash.com/photo-1586942593565-47dbbda2f5d4?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        title: "Engineering Graphics Drafter",
        price: "₹800",
        image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        title: "Programming Textbook (Mint)",
        price: "₹450",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        title: "Hero Sprint Bicycle",
        price: "₹4,000",
        image: "https://images.unsplash.com/photo-1508973376-84eb1e6ffbd8?auto=format&fit=crop&w=600&q=80",
    },
];

export const FeaturedListingsSection = () => {
    return (
        <AnimatedSection className="py-10 bg-gradient-to-b from-blue-50 to-blue-100/50 m-16 rounded-xl">
            <div className="container mx-auto px-6">
                {/* Section Title */}
                <h2
                    className="text-center mb-12
                    text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
                >
                    Latest on Campus
                </h2>

                {/* Listings Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {listingsData.map((item) => (
                        <Card
                            key={item.id}
                            className="overflow-hidden bg-white border border-blue-100 rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/50"
                        >
                            {/* Image */}
                            <div className="relative">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-48 object-cover rounded-t-2xl"
                                />
                                <div className="absolute top-2 right-2 bg-blue-600/80 text-xs text-white px-2 py-1 rounded-md shadow-sm">
                                    Featured
                                </div>
                            </div>

                            {/* Card Content */}
                            <CardHeader className="p-4">
                                <CardTitle className="truncate text-lg">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="text-2xl font-bold text-blue-600">
                                    {item.price}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:shadow-blue-300/40 transition-all">
                        View All Items
                    </Button>
                </div>
            </div>
        </AnimatedSection>
    );
};
