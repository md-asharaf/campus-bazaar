// src/components/sections/TrustAndSafetySection.tsx
import { DollarSign, Star } from "lucide-react";
import { FeatureHighlight } from "../FeatureHighlight";
import { AnimatedSection } from "../motion/AnimatedSection";

export const TrustAndSafetySection = () => {
    const features = [
        {
            icon: DollarSign,
            title: "Save Money",
            description:
                "Get textbooks and essentials at student-friendly prices",
        },
        {
            icon: Star,
            title: "Trusted Community",
            description: "Buy and sell within your verified campus community",
        },
    ];
    return (
        <AnimatedSection>
            <div className="max-w-4xl mx-auto py-10">
                <h3 className="text-3xl font-bold mb-12 tracking-tight text-foreground md:text-4xl lg:text-5xl text-center">
                    Why Students Love Our Marketplace
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <FeatureHighlight key={index} {...feature} />
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};
