import { Menu, Search, X } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
import { SearchPopover } from "../popovers/Search"
import { Button } from "../ui/button"
export const Header = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const links = [
        {
            name: "Home",
            path: "/"
        },
        {
            name: "Items",
            path: "/items"
        },
        {
            name: "Categories",
            path: "/categories"
        },
        {
            name: "Messaging",
            path: "/messaging"
        },
        {
            name: "About",
            path: "/about"
        },
    ]
    return (
        <nav className="sticky top-2 md:top-10 w-full z-50 backdrop-blur-xs">
            <div className="bg-background/10 mx-auto flex max-w-7xl border rounded-full items-center justify-between pr-6">
                <div className="flex items-center space-x-2">
                    <Link to="/" aria-label="Home">
                        <img
                            src={"/logo.png"}
                            alt="Logo"
                            width={50}
                            height={50}
                            className="h-10 w-10 md:h-16 md:w-16 rounded-full"
                        />
                    </Link>
                </div>

                <ul className="hidden md:flex items-center space-x-4 lg:space-x-8 font-medium text-foreground">
                    {links.map((link) => (
                        <motion.li
                            key={link.path}
                            className="relative"
                            initial="rest"
                            whileHover="hover"
                            animate="rest"
                        >
                            <Link
                                to={link.path}
                                className="hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary px-1 relative"
                            >
                                {link.name}
                                <motion.span
                                    variants={{
                                        rest: { scaleX: 0 },
                                        hover: { scaleX: 1 },
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="origin-left absolute left-0 -bottom-6 h-[1px] w-full bg-primary"
                                    style={{ display: "block" }}
                                />
                            </Link>
                        </motion.li>
                    ))}
                </ul>

                <div className="hidden md:flex items-center space-x-3">
                    <SearchPopover />
                    <Link
                        to="/sell"
                    >
                        <Button className="rounded-full">Sell Item</Button>
                    </Link>
                    <Link
                        to="/login"
                    >
                        <Button variant="outline" className="rounded-full">
                            Login
                        </Button>
                    </Link>
                </div>

                {/* Mobile Actions */}
                <div className="flex md:hidden items-center space-x-2">
                    {/* Mobile Search */}
                    <Link
                        to="/items"
                        className="p-2 rounded-full hover:bg-secondary transition-colors duration-200 focus:outline-none"
                        aria-label="Search"
                    >
                        <Search size={18} className="text-muted-foreground" />
                    </Link>

                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-full hover:bg-secondary transition-colors duration-200 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X size={20} className="text-foreground" />
                        ) : (
                            <Menu size={20} className="text-foreground" />
                        )}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-secondary shadow-lg">
                    <div className="px-4 py-4 space-y-3">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="block py-3 px-2 text-secondary-foreground hover:text-accent rounded-md transition-all duration-200 font-medium hover:bg-background"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile CTA Button - Accent for primary action */}
                        <div className="pt-4 border-t border-border">
                            <Link
                                to="/demo-class"
                                className="block w-full text-center rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium shadow-md hover:bg-primary/90 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sell Item
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}