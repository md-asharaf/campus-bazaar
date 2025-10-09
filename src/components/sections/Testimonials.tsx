import { AnimatedSection } from "../motion/AnimatedSection";
import { useState, useEffect, useRef } from "react";
import { Star, Quote } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonialsData = [
    {
        name: "Priya Sharma",
        handle: "@cs_student_2024",
        text: "Sold my old laptop in just 2 days! The campus marketplace made it so easy to connect with buyers from my own college.",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        course: "Computer Science",
        year: "Final Year",
        rating: 5,
    },
    {
        name: "Arjun Patel",
        handle: "@mech_engineer_23",
        text: "Found amazing deals on textbooks here. Saved over ₹5000 this semester compared to buying new books!",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        course: "Mechanical Engineering",
        year: "3rd Year",
        rating: 5,
    },
    {
        name: "Sneha Reddy",
        handle: "@bio_student_2025",
        text: "The safest way to buy and sell on campus. Love that I can trust fellow students and meet on campus grounds.",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        course: "Biotechnology",
        year: "2nd Year",
        rating: 5,
    },
    {
        name: "Rahul Kumar",
        handle: "@ece_final_year",
        text: "Bought a great bicycle for campus commute at half the market price. This platform is a game-changer for students!",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        course: "Electronics & Communication",
        year: "Final Year",
        rating: 5,
    },
    {
        name: "Ananya Singh",
        handle: "@mba_student_24",
        text: "Perfect for selling dorm furniture before graduation. Quick, easy, and trustworthy student community.",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        course: "MBA",
        year: "2nd Year",
        rating: 5,
    },
    {
        name: "Vikram Joshi",
        handle: "@civil_eng_2023",
        text: "From lab equipment to study materials, found everything I needed at student-friendly prices. Highly recommend!",
        image: "https://randomuser.me/api/portraits/men/6.jpg",
        course: "Civil Engineering",
        year: "Final Year",
        rating: 5,
    },
];

export const TestimonialsSection = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api])
    const plugin = useRef(
        Autoplay({ delay: 3000 })
    );

    return (
        <AnimatedSection>
            <div className=" px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted/20">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Star className="w-4 h-4 fill-current" />
                            Student Reviews
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                            What Students Say About
                            <span className="text-primary block">CampusBazaar</span>
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of students who trust our marketplace for safe,
                            affordable, and convenient buying and selling on campus.
                        </p>
                    </div>

                    {/* Testimonials Scroll Area */}
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        plugins={[plugin.current]}
                        className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
                    >
                        <CarouselContent className="-ml-4 py-2">
                            {testimonialsData.map((testimonial, index) => (
                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div className="h-full bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                        <div className="flex-grow">
                                            {/* Quote Icon */}
                                            <div className="flex justify-end mb-2">
                                                <Quote className="w-6 h-6 text-primary/20" />
                                            </div>

                                            {/* Rating */}
                                            <div className="flex gap-1 mb-4">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                                ))}
                                            </div>

                                            {/* Testimonial Text */}
                                            <blockquote className="text-foreground mb-6 leading-relaxed text-sm">
                                                "{testimonial.text}"
                                            </blockquote>
                                        </div>

                                        {/* Student Info */}
                                        <div className="flex items-center gap-3 mt-auto">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-foreground text-sm">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {testimonial.course} • {testimonial.year}
                                                </p>
                                                <p className="text-xs text-primary font-medium">
                                                    {testimonial.handle}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:inline-flex" />
                        <CarouselNext className="hidden sm:inline-flex" />
                    </Carousel>
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {Array.from({ length: count }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => api?.scrollTo(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${current === i
                                    ? "w-4 bg-primary"
                                    : "w-2 bg-primary/20"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};