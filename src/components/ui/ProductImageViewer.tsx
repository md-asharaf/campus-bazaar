import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Download, Share2 } from "lucide-react";

interface ProductImageViewerProps {
    images: string[];
    title: string;
    isOpen: boolean;
    onClose: () => void;
    initialIndex?: number;
}

export const ProductImageViewer: React.FC<ProductImageViewerProps> = ({
    images,
    title,
    isOpen,
    onClose,
    initialIndex = 0
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!isOpen || !images.length) return null;

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsZoomed(false);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsZoomed(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
                <div className="flex items-center justify-between text-white">
                    <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <p className="text-sm text-white/70">
                            {currentIndex + 1} of {images.length} photos
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsZoomed(!isZoomed)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ZoomIn size={20} />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Download size={20} />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Share2 size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4 pt-20 pb-24">
                <img
                    src={images[currentIndex]}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                        isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Bottom Thumbnail Strip */}
            {images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setIsZoomed(false);
                                }}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                    index === currentIndex
                                        ? 'border-white shadow-lg'
                                        : 'border-white/30 hover:border-white/60'
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {index === currentIndex && (
                                    <div className="absolute inset-0 bg-white/20" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center">
                <p>Use arrow keys to navigate • Click image to zoom • Press ESC to close</p>
            </div>
        </div>
    );
};