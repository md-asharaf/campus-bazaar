import React from "react";

export interface FeatureHighlightProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
    icon: Icon,
    title,
    description,
}) => (
    <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 hover:scale-105 cursor-pointer active:scale-95 touch-manipulation border border-transparent hover:border-primary/20">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{title}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    </div>
);