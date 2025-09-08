// src/app/page.tsx
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CategoriesSection } from "@/components/sections/Categories";
import { FeaturedListingsSection } from "@/components/sections/FeaturedListings";
import { HeroSection } from "@/components/sections/Hero";
import { HowItWorksSection } from "@/components/sections/HowItWorks";
import { TestimonialsSection } from "@/components/sections/Testimonials";
import { TrustAndSafetySection } from "@/components/sections/TrustAndSafety";
import ShaderBackground from "./components/ShaderBackground";

export default function LandingPage() {
    return (
        <div className="bg-background text-foreground font-sans">
            <main>
                <ShaderBackground>
                    <Header />
                    <HeroSection />
                </ShaderBackground>
                <CategoriesSection />
                <FeaturedListingsSection />
                <HowItWorksSection />
                <TrustAndSafetySection />
                <TestimonialsSection />
            </main>
            <Footer />
        </div>
    );
}
