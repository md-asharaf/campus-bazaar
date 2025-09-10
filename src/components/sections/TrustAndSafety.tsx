import { DollarSign, Star } from "lucide-react";
import { FeatureHighlight } from "./FeatureHighlight";
import { AnimatedSection } from "../motion/AnimatedSection";

export const TrustAndSafetySection = () => {
    const features = [
        {
            icon: DollarSign,
            title: "Save Money",
            description:
                "Get textbooks and essentials at student-friendly prices - save up to 70% compared to retail",
        },
        {
            icon: Star,
            title: "Trusted Community",
            description: "Buy and sell within your verified campus community with student ID verification",
        },
    ];
    return (
        <AnimatedSection>
            <div className="max-w-4xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
                <h3 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 tracking-tight text-foreground text-center">
                    Why Students Love Our Marketplace
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
                    Built by students, for students. Experience the safest and most affordable way to trade on campus.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {features.map((feature, index) => (
                        <FeatureHighlight key={index} {...feature} />
                    ))}
                </div>

                {/* Additional trust indicators */}
                <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-green-50 p-4 rounded-xl">
                        <div className="text-lg sm:text-xl font-bold text-green-600">99%</div>
                        <div className="text-xs sm:text-sm text-green-700">Safe Transactions</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="text-lg sm:text-xl font-bold text-blue-600">24/7</div>
                        <div className="text-xs sm:text-sm text-blue-700">Campus Support</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                        <div className="text-lg sm:text-xl font-bold text-purple-600">500+</div>
                        <div className="text-xs sm:text-sm text-purple-700">Active Students</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                        <div className="text-lg sm:text-xl font-bold text-orange-600">₹2L+</div>
                        <div className="text-xs sm:text-sm text-orange-700">Money Saved</div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};
