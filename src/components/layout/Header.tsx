import { useState, useEffect } from "react";
import { HomeIcon, DashboardIcon, InfoCircledIcon, HamburgerMenuIcon, Cross1Icon, ChatBubbleIcon, PersonIcon } from "@radix-ui/react-icons";
import { SearchPopover } from "../popovers/Search";
import { MessageNotification } from "../messaging/MessageNotification";
import { AuthManager } from "../auth/AuthManager";
import { UserProfile } from "../auth/UserProfile";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const navItems = [
    { name: "Home", icon: <HomeIcon className="w-[18px] h-[18px]" />, to: "/" },
    { name: "Categories", icon: <DashboardIcon className="w-[18px] h-[18px]" />, to: "/categories" },
    { name: "Messages", icon: <ChatBubbleIcon className="w-[18px] h-[18px]" />, to: "/messages" },
    { name: "About", icon: <InfoCircledIcon className="w-[18px] h-[18px]" />, to: "/about" },
];

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { user } = useAuth();

    // Close mobile menu when clicking outside or on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Element;
            if (mobileMenuOpen && !target.closest('header')) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('click', handleClickOutside);
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('click', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <header className="sticky top-2 sm:top-4 inset-x-0 mx-auto w-[calc(100%-1rem)] sm:w-full max-w-7xl bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-full shadow-2xl z-50">
                <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-2 md:px-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-white text-black font-bold text-sm sm:text-base md:text-lg flex items-center justify-center rounded-lg px-2 py-1 sm:px-2.5">
                            KIST
                        </div>
                        <span className="font-semibold text-sm sm:text-base md:text-lg text-white hidden xs:block">
                            Bazaar
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex">
                        <ul className="flex items-center gap-1 bg-black/20 p-1 rounded-full">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.to}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 rounded-full hover:bg-white/10 hover:text-white transition-all duration-200 hover:scale-105"
                                    >
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile/Tablet Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Search - hidden on very small screens */}
                        <div className="hidden xs:block">
                            <SearchPopover />
                        </div>

                        {/* Messages - only show if logged in */}
                        {user && <MessageNotification unreadCount={3} />}

                        {/* User Profile or Sign In */}
                        {user ? (
                            <button
                                onClick={() => setShowProfile(true)}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {user.picture ? (
                                    <img
                                        src={user.picture}
                                        alt={user.name}
                                        className="w-6 h-6 rounded-full"
                                    />
                                ) : (
                                    <PersonIcon className="w-4 h-4" />
                                )}
                                <span className="hidden sm:block text-xs font-medium">
                                    {user.name.split(' ')[0]}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowAuth(true)}
                                className="bg-emerald-500 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full hover:bg-emerald-600 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                            >
                                Sign In
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden flex items-center justify-center p-2 rounded-full text-white hover:bg-white/10 transition-all duration-200 active:scale-95 touch-manipulation"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <div className="relative w-6 h-6">
                                <HamburgerMenuIcon
                                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                                        }`}
                                />
                                <Cross1Icon
                                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                    style={{ top: '0' }}
                />

                {/* Mobile Menu */}
                <nav
                    className={`lg:hidden absolute left-0 right-0 top-full mt-2 mx-2 sm:mx-0 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-300 transform ${mobileMenuOpen
                        ? 'opacity-100 visible translate-y-0 scale-100'
                        : 'opacity-0 invisible -translate-y-4 scale-95'
                        }`}
                >
                    <div className="p-4 space-y-1">
                        {/* Search on mobile - show if hidden in header */}
                        <div className="xs:hidden mb-4">
                            <SearchPopover />
                        </div>

                        {/* Navigation Items */}
                        <ul className="space-y-1">
                            {navItems.map((item, index) => (
                                <li
                                    key={item.name}
                                    className={`transform transition-all duration-300 ${mobileMenuOpen
                                        ? 'translate-x-0 opacity-100'
                                        : 'translate-x-4 opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                >
                                    <Link
                                        to={item.to}
                                        className="flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-200 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-95 touch-manipulation"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span className="flex-shrink-0">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile Menu Footer */}
                        <div className="pt-4 mt-4 border-t border-white/10">
                            <div className="text-xs text-gray-400 text-center">
                                KIST Bazaar
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Auth Components */}
            <AuthManager
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
            />
            <UserProfile
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
            />
        </>
    );
};
