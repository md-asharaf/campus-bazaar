import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageMessageProps {
    media: string[];  // Array of URL strings
}

const ImageMessage = ({ media }: ImageMessageProps) => {
    const [showPreview, setShowPreview] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setShowPreview(true);
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % media.length);
    };

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    if (!media || media.length === 0) return null;

    return (
        <>
            <div className="grid gap-1 p-0">
                {media.length === 1 && (
                    <img
                        src={media[0]}
                        alt="Shared image"
                        className="w-full max-w-sm rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(0)}
                    />
                )}

                {media.length === 2 && (
                    <div className="grid grid-cols-2 gap-1">
                        {media.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => handleImageClick(index)}
                            />
                        ))}
                    </div>
                )}

                {media.length === 3 && (
                    <div className="grid grid-cols-2 gap-1">
                        <img
                            src={media[0]}
                            alt="Image 1"
                            className="w-full h-full row-span-2 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(0)}
                        />
                        <img
                            src={media[1]}
                            alt="Image 2"
                            className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(1)}
                        />
                        <img
                            src={media[2]}
                            alt="Image 3"
                            className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(2)}
                        />
                    </div>
                )}

                {media.length >= 4 && (
                    <div className="grid grid-cols-2 gap-1">
                        {media.slice(0, 3).map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => handleImageClick(index)}
                            />
                        ))}
                        <div
                            className="relative w-full h-40 cursor-pointer group"
                            onClick={() => handleImageClick(3)}
                        >
                            <img
                                src={media[3]}
                                alt="Image 4"
                                className="w-full h-full object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                            />
                            {media.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                    <span className="text-white text-2xl font-bold">
                                        +{media.length - 4}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                        onClick={() => setShowPreview(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    <div className="relative flex items-center justify-center min-h-[60vh] max-h-[90vh]">
                        {media.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 z-50 text-white hover:bg-white/20"
                                    onClick={handlePrevious}
                                >
                                    <ChevronLeft className="h-8 w-8" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 z-50 text-white hover:bg-white/20"
                                    onClick={handleNext}
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </Button>
                            </>
                        )}

                        <img
                            src={media[currentImageIndex]}
                            alt={`Preview ${currentImageIndex + 1}`}
                            className="w-full h-auto max-h-[90vh] object-contain"
                        />

                        {media.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                {currentImageIndex + 1} / {media.length}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 p-4 overflow-x-auto">
                        {media.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Thumbnail ${index + 1}`}
                                className={`h-16 w-16 object-cover rounded cursor-pointer transition-all ${
                                    index === currentImageIndex
                                        ? "ring-2 ring-white opacity-100"
                                        : "opacity-50 hover:opacity-75"
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ImageMessage;