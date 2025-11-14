import { Upload, Search, MessageCircle, ShoppingCart } from "lucide-react";
import { AnimatedSection } from "../motion/AnimatedSection";
import { motion } from "framer-motion";

const steps = [
    {
        icon: Upload,
        title: "List Your Item",
        description: "Take photos and create a listing for your items in minutes."
    },
    {
        icon: Search,
        title: "Students Discover",
        description: "Other students browse and find your items on campus."
    },
    {
        icon: MessageCircle,
        title: "Chat & Negotiate",
        description: "Connect with buyers through our messaging system."
    },
    {
        icon: ShoppingCart,
        title: "Complete Deal",
        description: "Meet safely on campus and complete the transaction."
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
};

export const HowItWorksSection = () => {
    return (
        <AnimatedSection>
            <div className="px-4 sm:px-6 lg:px-8 bg-background">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                            How Students Buy & Sell on CampusBazaar
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Simple steps to buy and sell with fellow students on your campus
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className={`relative bg-card border rounded-2xl p-8 text-left overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group
                                ${index === 0 && 'lg:col-span-2'}
                                ${index === 3 && 'lg:col-span-2'}
                                `}
                            >
                                {/* Creative and Bigger Step Count */}
                                <div className="absolute top-2 -right-0 text-8xl font-bold text-primary/10 select-none pointer-events-none">
                                    0{index + 1}
                                </div>

                                <div className="mb-6 w-18 h-18 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <step.icon className="w-9 h-9 text-primary" />
                                </div>
                                <h3 className="text-2xl font-semibold text-foreground mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </AnimatedSection>
    );
};