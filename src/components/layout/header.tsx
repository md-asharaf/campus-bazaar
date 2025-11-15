import { Menu, Search, X, User, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { SearchPopover } from "../popovers/search"
import { Button } from "../ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"

export const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Determine if we're on the home page
    const isHomePage = location.pathname === '/';

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
            path: "/messages"
        },
        {
            name: "About",
            path: "/about"
        },
    ]

    return (
        <motion.nav
            className={`w-full z-50 backdrop-blur-sm ${isHomePage ? 'sticky' : ''}`}
            initial={false}
            animate={{
                top: isHomePage ? "0.5rem" : "0",
                paddingTop: isHomePage ? "0" : "0",
                paddingBottom: isHomePage ? "0" : "0"
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <motion.div
                className={`flex items-center ${isHomePage ? 'justify-between' : 'justify-around'} backdrop-blur-md ${
                    isHomePage
                        ? 'border rounded-full mx-auto max-w-7xl pr-6'
                        : 'border-b w-full px-4 py-2'
                }`}
                initial={false}
                animate={{
                    backgroundColor: isHomePage
                        ? "hsl(var(--background) / 0.1)"
                        : "hsl(var(--background) / 0.95)"
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <Link to="/" aria-label="Home">
                        <motion.img
                            src={"/logo.png"}
                            alt="Logo"
                            width={50}
                            height={50}
                            className="rounded-full"
                            initial={false}
                            animate={{
                                width: isHomePage ? 64 : 40,
                                height: isHomePage ? 64 : 40
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                    </Link>
                    <AnimatePresence>
                        {!isHomePage && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link to="/" className="text-lg font-semibold text-foreground">
                                    CampusBazaar
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop Navigation Links */}
                <motion.ul
                    className="hidden md:flex items-center font-medium text-foreground"
                    initial={false}
                    animate={{
                        gap: isHomePage ? "2rem" : "2.3rem"
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
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
                                    className="origin-left absolute left-0 -bottom-6 h-px w-full bg-primary"
                                    style={{ display: "block" }}
                                />
                            </Link>
                        </motion.li>
                    ))}
                </motion.ul>

                {/* Desktop Actions */}
                <motion.div
                    className="hidden md:flex items-center"
                    initial={false}
                    animate={{
                        gap: isHomePage ? "1rem" : "1.5rem"
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <SearchPopover />
                    {user ? (
                        <>
                            <Link to="/sell">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        className={isHomePage ? "rounded-full" : "rounded-md"}
                                        size={isHomePage ? "default" : "sm"}
                                    >
                                        Sell Item
                                    </Button>
                                </motion.div>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar || ''} alt={user.name} />
                                            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/dashboard">
                                            <User className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/wishlist">
                                            <span className="mr-2">♥</span>
                                            Wishlist
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/messages">
                                            <span className="mr-2">💬</span>
                                            Messages
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout()}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link to="/sell">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        className={isHomePage ? "rounded-full" : "rounded-md"}
                                        size={isHomePage ? "default" : "sm"}
                                    >
                                        Sell Item
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link to="/student-login">
                              <Button variant="outline" className="rounded-full" size={isHomePage ? "default" : "sm"}>
                                Login
                              </Button>
                            </Link>
                        </>
                    )}
                </motion.div>

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
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="md:hidden border-t border-border bg-secondary shadow-lg"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
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

                            {/* Mobile Auth Section */}
                            <div className="pt-4 border-t border-border space-y-3">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar || ''} alt={user.name} />
                                                <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{user.name}</p>
                                                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to="/sell"
                                            className="block w-full text-center rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium shadow-md hover:bg-primary/90 transition-colors duration-200"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Sell Item
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className="block w-full text-center rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-muted transition-colors duration-200"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="w-full"
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Log out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/sell"
                                            className="block w-full text-center rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium shadow-md hover:bg-primary/90 transition-colors duration-200"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Sell Item
                                        </Link>
                                        <Link to="/student-login">
                                          <Button>
                                            Login
                                          </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}