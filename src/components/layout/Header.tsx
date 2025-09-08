import { Home, Briefcase, Tag, Star } from "lucide-react";
import { SearchPopover } from "../popovers/Search";

const navItems = [
    { name: "Home", icon: <Home size={14} /> },
    { name: "Categories", icon: <Briefcase size={14} /> },
    { name: "Contact", icon: <Tag size={14} /> },
    { name: "About", icon: <Star size={14} /> },
];

export const Header = () => {
    return (
        <>
            <header className="sticky top-4 inset-x-0 mx-auto w-full max-w-7xl bg-black/20 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl z-50">
                <div className="flex items-center justify-between px-4 py-2">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2">
                        <div className="bg-white text-black font-bold text-lg flex items-center justify-center rounded-md px-2">
                            Campus
                        </div>
                        <span className="font-semibold text-lg text-white">
                            Bazaar
                        </span>
                    </a>

                    {/* Navigation */}
                    <nav className="hidden md:flex">
                        <ul className="flex items-center gap-2 bg-black/20 p-1 rounded-full">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        {item.icon}
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <SearchPopover />
                        <button className="bg-green-300 text-gray-900 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-lime-400 transition-colors">
                            Sign In
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};
