import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <div className="text-8xl mb-6">🤔</div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                🏠 Go Home
                            </Button>
                        </Link>
                        <Link to="/categories">
                            <Button variant="outline">
                                📂 Browse Categories
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}