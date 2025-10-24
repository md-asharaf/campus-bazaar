import { Hero } from "@/components/sections/Hero";
import { HowItWorksSection } from "@/components/sections/HowItWorks";
import { TestimonialsSection } from "@/components/sections/Testimonials";
import { TrustAndSafetySection } from "@/components/sections/TrustAndSafety";

export function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Hero />
        <HowItWorksSection />
        <TrustAndSafetySection />
        <div className="py-10">
          <TestimonialsSection />
        </div>
      </div>
    </div>
  )
}