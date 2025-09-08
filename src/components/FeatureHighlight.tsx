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
    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <h4 className="font-medium text-foreground mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);
