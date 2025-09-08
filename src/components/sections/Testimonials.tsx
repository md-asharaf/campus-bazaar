import { AnimatedSection } from "../motion/AnimatedSection";

const testimonialsData = [
    {
        name: "Christine Jackson",
        handle: "luminous_statue_35",
        text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        rotation: "0deg",
    },
    {
        name: "Yasmine Garcia",
        handle: "pendulous_ukulele_30",
        text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        rotation: "-2deg",
    },
    {
        name: "Sakura Palastri",
        handle: "salubrious_producer_83",
        text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        rotation: "2deg",
    },
    {
        name: "Bạc Lô Linh",
        handle: "puckish_cookies_38",
        text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        rotation: "0deg",
    },
    {
        name: "Ibrahim Mahmud",
        handle: "limpid_cupcake_68",
        text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        rotation: "1deg",
    },
    {
        name: "Margaret Taylor",
        handle: "amatory_clerk_73",
        text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        rotation: "-1deg",
    },
];

export const TestimonialsSection = () => {
    return (
        <AnimatedSection>
            <div className="bg-gradient-to-b from-pink-50 to-pink-100 p-10 text-center font-sans m-16 rounded-xl">
                <h4 className="text-gray-800 text-lg mb-2">Testimonials ☺</h4>
                <h1 className=" mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                    Our trusted Customers
                </h1>
                <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-10">
                    Our mission is to empower students by providing a trusted
                    campus marketplace where they can buy, sell, and connect. We
                    aim to make student life more affordable, sustainable, and
                    community-driven by facilitating safe and easy exchanges of
                    goods and resources.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
                    {testimonialsData.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-3xl shadow-lg text-center relative transform transition-transform duration-300"
                            style={{
                                transform: `rotate(${testimonial.rotation})`,
                            }}
                        >
                            <div>
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-20 h-20 rounded-full mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold text-black mb-2">
                                    {testimonial.name}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-800">
                                {testimonial.text}
                            </p>
                            <div className="w-full flex items-center justify-center">
                                <img
                                    src="quote.png"
                                    alt="quote icon"
                                    className="w-12 h-12"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};
