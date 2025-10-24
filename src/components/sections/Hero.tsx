import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShoppingCart, Tag } from "lucide-react";
import { Link } from "react-router-dom";
const stats = [
    { value: "₹2L+", label: "Money Saved" },
    { value: "1,200+", label: "Items Listed" },
    { value: "99%", label: "Safe Transactions" },
    { value: "500+", label: "Active Members" },
];

export const Hero = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden text-foreground">
            {/* Content */}
            <div className="relative z-10 flex h-screen flex-col items-center justify-center p-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight sm:leading-tight md:leading-tight">
                        Stop Overpaying.
                        <br />
                        <span className="bg-linear-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Start Trading on Campus.
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-base text-muted-foreground sm:text-lg md:text-xl">
                        CampusBazaar is the exclusive student marketplace to buy, sell, and trade textbooks, electronics, and dorm essentials—safely and affordably.
                    </p>
                </motion.div>

                {/* Call to Action Buttons */}
                <motion.div
                    className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Link to="/items">
                        <Button size="lg" className="w-full sm:w-auto">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Explore Items
                        </Button>
                    </Link>
                    <Link to="/sell">
                        <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                            <Tag className="mr-2 h-5 w-5" />
                            Sell Your Item
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    className="mt-16 w-full max-w-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <div className="rounded-2xl border border-border/50 bg-background/30 p-4 sm:p-6 backdrop-blur-lg">
                        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div key={index}>
                                    <p className="text-2xl font-bold text-primary sm:text-3xl">
                                        {stat.value}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}