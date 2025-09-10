import { Github, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-blue-950 to-blue-900 text-blue-100 py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                {/* Top Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 text-center sm:text-left">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide mb-3">
                            CampusBazaar
                        </h3>
                        <p className="text-blue-300 text-sm sm:text-base leading-relaxed mb-4">
                            The trusted student marketplace to buy, sell, and
                            trade on campus safely and affordably.
                        </p>
                        
                        {/* Quick action buttons */}
                        <div className="flex flex-col xs:flex-row gap-3 justify-center sm:justify-start">
                            <button className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation">
                                🎓 Join Campus
                            </button>
                            <button className="bg-transparent border border-blue-600 hover:bg-blue-800 text-blue-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation">
                                💬 Start Selling
                            </button>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-400 transition-colors text-sm sm:text-base"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-400 transition-colors text-sm sm:text-base"
                                >
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-400 transition-colors text-sm sm:text-base"
                                >
                                    Safety Guidelines
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-400 transition-colors text-sm sm:text-base"
                                >
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Contact */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-white mb-4">
                            Stay Connected
                        </h4>
                        <div className="flex justify-center sm:justify-start space-x-4 mb-4">
                            <a
                                href="#"
                                className="p-2.5 rounded-full bg-blue-800 hover:bg-blue-700 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="#"
                                className="p-2.5 rounded-full bg-blue-800 hover:bg-blue-700 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="#"
                                className="p-2.5 rounded-full bg-blue-800 hover:bg-blue-700 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                            >
                                <Instagram size={18} />
                            </a>
                        </div>
                        
                        {/* Contact info */}
                        <div className="text-xs sm:text-sm text-blue-300 space-y-1">
                            <p>📧 support@campusbazaar.com</p>
                            <p>📞 +91 98765 43210</p>
                            <p>🏫 Available on 50+ campuses</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-800 mt-8 sm:mt-10 pt-6 text-center">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs sm:text-sm text-blue-400">
                            © {new Date().getFullYear()} CampusBazaar. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-xs text-blue-500">
                            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                    <p className="text-xs text-blue-500 mt-3">
                        Built with ❤️ for students to buy & sell safely on campus.
                    </p>
                </div>
            </div>
        </footer>
    );
};
