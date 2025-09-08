// src/components/layout/Footer.tsx
import { Github, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-blue-950 to-blue-900 text-blue-100 py-12">
            <div className="container mx-auto px-6 md:px-12">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-wide">
                            CampusBazaar
                        </h3>
                        <p className="mt-3 text-blue-300 text-sm leading-relaxed">
                            The trusted student marketplace to buy, sell, and
                            trade on campus.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Safety Tips
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Stay Connected
                        </h4>
                        <div className="flex justify-center md:justify-start space-x-6">
                            <a
                                href="#"
                                className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-800 mt-10 pt-6 text-center">
                    <p className="text-sm text-blue-400">
                        © {new Date().getFullYear()} CampusBazaar. All rights
                        reserved.
                    </p>
                    <p className="text-xs text-blue-500 mt-2">
                        Built with ❤️ for students to buy & sell safely.
                    </p>
                </div>
            </div>
        </footer>
    );
};
