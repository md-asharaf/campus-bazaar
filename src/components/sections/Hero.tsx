"use client";

export const HeroSection = () => {
    return (
        <main className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center min-h-screen z-20">
            <div className="text-left">
                <div
                    className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
                    style={{
                        filter: "url(#glass-effect)",
                    }}
                >
                    <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                    <span className="text-white/90 text-xs font-light relative z-10">
                        ✨ The Student-First Marketplace
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-6xl md:text-7xl md:leading-[5rem] tracking-tight font-light text-white mb-6">
                    <span className="font-bold italic instrument text-7xl md:text-8xl">
                        The Ultimate
                    </span>{" "}
                    Campus
                    <br />
                    <span className="font-light tracking-tight text-white text-6xl md:text-7xl">
                        Marketplace
                    </span>
                </h1>

                {/* Description */}
                <p className="text-lg font-light text-white/80 mb-6 leading-relaxed max-w-md">
                    Find exclusive deals on textbooks, furniture, and
                    electronics from students you trust. Save money, reduce
                    waste, and connect with your campus community.
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-6 flex-wrap">
                    <button className="px-10 py-4 rounded-full bg-transparent border border-white/30 text-white font-semibold transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer text-lg">
                        Find a Deal
                    </button>
                    <button className="px-10 py-4 rounded-full bg-white text-black font-semibold transition-all duration-200 hover:bg-white/90 cursor-pointer text-lg">
                        Sell an Item
                    </button>
                </div>
            </div>
        </main>
    );
};
