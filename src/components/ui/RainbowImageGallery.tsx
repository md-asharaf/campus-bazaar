import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RainbowImageGalleryProps {
    images: string[];
    title: string;
    className?: string;
}

export const RainbowImageGallery: React.FC<RainbowImageGalleryProps> = ({
    images,
    title,
    className = ""
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className={`w-full h-40 sm:h-48 bg-gray-200 rounded-t-xl flex items-center justify-center ${className}`}>
                <span className="text-gray-400">No image</span>
            </div>
        );
    }

    const handleImageClick = (index: number) => {
        setActiveIndex(index);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            className={`relative overflow-hidden rounded-t-xl ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Image */}
            <div className="relative w-full h-40 sm:h-48">
                <img
                    src={images[activeIndex]}
                    alt={`${title} - Image ${activeIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Navigation Arrows - Show on hover if multiple images */}
                {images.length > 1 && isHovered && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all duration-200 hover:scale-110"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all duration-200 hover:scale-110"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        {activeIndex + 1}/{images.length}
                    </div>
                )}
            </div>

            {/* Rainbow Gallery - Shows on hover */}
            {images.length > 1 && (
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                        }`}
                >
                    <div className="flex gap-1.5 justify-center">
                        {images.map((image, index) => {
                            const isActive = index === activeIndex;
                            const position = index - activeIndex;

                            // Calculate rainbow position and styling
                            const getImageStyle = () => {
                                // const baseSize = isActive ? 'w-12 h-12' : 'w-8 h-8';
                                // const zIndex = isActive ? 'z-20' : 'z-10';

                                // Rainbow arc positioning
                                const angle = position * 15; // degrees
                                const distance = Math.abs(position) * 2; // pixels
                                const yOffset = Math.abs(position) * 1; // slight arc

                                const transform = `translateX(${distance * Math.sign(position)}px) translateY(-${yOffset}px) rotate(${angle}deg)`;

                                return {
                                    transform: isHovered ? transform : 'translateY(0px)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transitionDelay: `${Math.abs(position) * 50}ms`
                                };
                            };

                            return (
                                <div
                                    key={index}
                                    className={`relative cursor-pointer transition-all duration-300 ${isActive ? 'w-12 h-12' : 'w-8 h-8'
                                        }`}
                                    style={getImageStyle()}
                                    onClick={() => handleImageClick(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`${title} - Thumbnail ${index + 1}`}
                                        className={`w-full h-full object-cover rounded-lg border-2 transition-all duration-200 ${isActive
                                            ? 'border-white shadow-lg shadow-white/30'
                                            : 'border-white/50 hover:border-white/80'
                                            }`}
                                    />

                                    {/* Rainbow glow effect */}
                                    <div
                                        className={`absolute inset-0 rounded-lg transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20'
                                            : 'bg-transparent'
                                            }`}
                                    />

                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Rainbow gradient line */}
                    <div className={`mt-2 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-500 ${isHovered ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                        }`} />
                </div>
            )}

            {/* Hover overlay with rainbow border */}
            <div
                className={`absolute inset-0 rounded-t-xl transition-all duration-300 pointer-events-none ${isHovered && images.length > 1
                    ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 via-blue-500/10 to-green-500/10'
                    : 'bg-transparent'
                    }`}
            />
        </div>
    );
};