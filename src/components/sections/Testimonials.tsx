import { AnimatedSection } from "../motion/AnimatedSection";

// Updated testimonials with college-specific content
const testimonialsData = [
    {
        name: "Priya Sharma",
        handle: "cs_student_2024",
        text: "Sold my old laptop in just 2 days! The campus marketplace made it so easy to connect with buyers from my own college.",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        rotation: "0deg",
        course: "Computer Science",
    },
    {
        name: "Arjun Patel",
        handle: "mech_engineer_23",
        text: "Found amazing deals on textbooks here. Saved over ₹5000 this semester compared to buying new books!",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        rotation: "-1deg",
        course: "Mechanical Engineering",
    },
    {
        name: "Sneha Reddy",
        handle: "bio_student_2025",
        text: "The safest way to buy and sell on campus. Love that I can trust fellow students and meet on campus grounds.",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        rotation: "1deg",
        course: "Biotechnology",
    },
    {
        name: "Rahul Kumar",
        handle: "ece_final_year",
        text: "Bought a great bicycle for campus commute at half the market price. This platform is a game-changer for students!",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        rotation: "0deg",
        course: "Electronics & Communication",
    },
    {
        name: "Ananya Singh",
        handle: "mba_student_24",
        text: "Perfect for selling dorm furniture before graduation. Quick, easy, and trustworthy student community.",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        rotation: "-1deg",
        course: "MBA",
    },
    {
        name: "Vikram Joshi",
        handle: "civil_eng_2023",
        text: "From lab equipment to study materials, found everything I needed at student-friendly prices. Highly recommend!",
        image: "https://randomuser.me/api/portraits/men/6.jpg",
        rotation: "1deg",
        course: "Civil Engineering",
    },
];

export const TestimonialsSection = () => {
    return (
        <AnimatedSection>
            <div className="bg-gradient-to-b from-pink-50 to-pink-100 p-4 sm:p-8 lg:p-10 text-center font-sans mx-4 sm:mx-8 lg:mx-16 rounded-xl sm:rounded-2xl">
                <h4 className="text-gray-800 text-sm sm:text-base lg:text-lg mb-2">Student Reviews 😊</h4>
                <h1 className="mb-4 text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                    What Students Say
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                    Join thousands of students who trust our marketplace for safe, 
                    affordable, and convenient buying and selling on campus.
                </p>
                
                {/* Mobile: Show 2 testimonials, Tablet: 4, Desktop: 6 */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-screen-xl mx-auto">
                    {testimonialsData.slice(0, 6).map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg text-center relative transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer active:scale-95 touch-manipulation"
                            style={{
                                transform: `rotate(${testimonial.rotation})`,
                            }}
                        >
                            <div>
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 sm:mb-4 border-2 border-pink-200"
                                />
                                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-black mb-1">
                                    {testimonial.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-pink-600 font-medium mb-3">
                                    {testimonial.course}
                                </p>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-4">
                                "{testimonial.text}"
                            </p>
                            
                            {/* Star rating */}
                            <div className="flex justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-sm">⭐</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-8 sm:mt-12">
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation">
                        Join Our Community
                    </button>
                </div>
            </div>
        </AnimatedSection>
    );
};
