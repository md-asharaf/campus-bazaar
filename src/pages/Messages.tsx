import { MessageCenter } from "../components/messaging/MessageCenter";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Messages() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 pt-24 pb-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">💬</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Sign in to view messages
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Connect with fellow KIST students to buy and sell items safely
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Sign in with Google
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 pt-20 pb-10">
            <MessageCenter />
        </div>
    );
}