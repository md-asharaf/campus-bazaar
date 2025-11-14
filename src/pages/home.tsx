import { Hero } from "@/components/sections/hero";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { TrustAndSafetySection } from "@/components/sections/trust-and-safety";

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