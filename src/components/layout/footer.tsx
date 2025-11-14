import { Github, Instagram, Linkedin } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-secondary text-secondary-foreground py-8">
            <div className="container mx-auto px-4">
                {/* Top Section */}
                <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-3">
                    {/* Brand */}
                    <div className="lg:col-span-1 sm:col-span-2">
                        <div className="flex items-center justify-center gap-3 mb-4 sm:justify-start">
                            <img
                                src="/logo.png"
                                alt="CampusBazaar Logo"
                                className="h-10 w-10 rounded-full"
                            />
                            <span className="text-xl font-bold tracking-wide text-foreground sm:text-2xl">CampusBazaar</span>
                        </div>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
                            The trusted student marketplace to buy, sell, and
                            trade on campus safely and affordably.
                        </p>

                        {/* Quick action buttons */}
                        <Button variant="default" className="">
                            💬 Start Selling
                        </Button>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-base font-semibold text-foreground mb-4 sm:text-lg">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/about"
                                    className="hover:text-primary transition-colors text-sm sm:text-base"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/how-it-works"
                                    className="hover:text-primary transition-colors text-sm sm:text-base"
                                >
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/safety"
                                    className="hover:text-primary transition-colors text-sm sm:text-base"
                                >
                                    Safety Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/support"
                                    className="hover:text-primary transition-colors text-sm sm:text-base"
                                >
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Contact */}
                    <div>
                        <h4 className="text-base font-semibold text-foreground mb-4 sm:text-lg">
                            Stay Connected
                        </h4>
                        <div className="flex justify-center space-x-4 mb-4 sm:justify-start">
                            <a
                                href="#"
                                className="p-2.5 rounded-full bg-background hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="#"
                                className="p-2.5 rounded-full bg-background hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="#"
                                className="p-2.5 rounded-full bg-background hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                            >
                                <Instagram size={18} />
                            </a>
                        </div>

                        {/* Contact info */}
                        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                            <p>📧 support@campusbazaar.com</p>
                            <p>📞 +91 98765 43210</p>
                            <p>🏫 Available on 50+ campuses</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="pt-6 mt-8 text-center border-t border-border">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            © {new Date().getFullYear()} CampusBazaar. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-xs">
                            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                            <Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                        Built with ❤️ for students to buy & sell safely on campus.
                    </p>
                </div>
            </div>
        </footer>
    );
};
