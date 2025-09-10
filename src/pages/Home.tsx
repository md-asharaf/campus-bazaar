import { CategoriesSection } from "@/components/sections/Categories";
import { FeaturedListingsSection } from "@/components/sections/FeaturedListings";
import { HeroSection } from "@/components/sections/Hero";
import { HowItWorksSection } from "@/components/sections/HowItWorks";
import { TestimonialsSection } from "@/components/sections/Testimonials";
import { TrustAndSafetySection } from "@/components/sections/TrustAndSafety";
import ShaderBackground from "@/components/ui/ShaderBackground";
import { Header } from "@/components/layout/Header";

export default function Home() {
    return (
        <>
            <ShaderBackground>
                <Header />
                <HeroSection />
            </ShaderBackground>
            
            {/* Main content sections with proper spacing */}
            <div className="relative z-10">
                <CategoriesSection />
                <FeaturedListingsSection />
                <HowItWorksSection />
                <TrustAndSafetySection />
                <TestimonialsSection />
            </div>

            {/* Mobile floating action button */}
            <div className="fixed bottom-6 right-4 sm:right-6 z-50 lg:hidden">
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </>
    );
}