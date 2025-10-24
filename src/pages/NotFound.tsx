export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex items-center justify-center bg-background py-8 flex-1">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="text-7xl">🤔</div>
                    <h1 className="text-3xl font-bold text-foreground">404 - Page Not Found</h1>
                    <p className="text-base text-muted-foreground">
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>
                </div>
            </div>
        </div>
    );
}