import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea"; 
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { BadgeCheck, Filter, MessageSquare, Search, Frown } from "lucide-react";
import { useEffect,useRef, useState, type Dispatch, type JSX, type SetStateAction, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";

interface Category {
    id: string;
    name: string;
}

// Mock data to be used as a fallback
const mockCategories: Category[] = [
    { id: "1", name: "Textbooks" }, { id: "2", name: "Electronics" }, { id: "3", name: "Furniture" },
    { id: "4", name: "Notes & Supplies" }, { id: "5", name: "Gaming" }, { id: "6", name: "Fashion" },
];

const mockUsers: User[] = Array.from({ length: 5 }, (_, i) => ({
    id: `user-${i}`,
    name: `Seller ${i + 1}`,
    avatar: `https://i.pravatar.cc/150?u=seller${i}`,
}));

const mockItems: Item[] = Array.from({ length: 24 }, (_, i) => ({
    id: `${i + 1}`,
    title: `Item Title ${i + 1}`,
    price: parseFloat((Math.random() * (10000 - 100) + 100).toFixed(2)),
    isVerified: Math.random() > 0.5,
    isSold: false,
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
    images: [
        { url: `https://picsum.photos/seed/${i + 1}-a/500/500` },
        { url: `https://picsum.photos/seed/${i + 1}-b/500/500` },
    ],
    seller: mockUsers[i % 5],
    category: mockCategories[i % mockCategories.length],
}));

interface User {
    id: string;
    name: string;
    avatar: string | null;
}

interface Item {
    id: string;
    title: string;
    price: number;
    isVerified: boolean;
    isSold: boolean;
    createdAt: string; // ISO string from API
    images: { url: string }[];
    // Assuming API returns nested objects for seller and category
    seller: User;
    category: Category;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// Helper to highlight search query in text
const highlightText = (text: string, query: string): ReactNode => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i} className="bg-primary/20 text-primary font-semibold rounded px-1">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    );
};

export const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const initialSearch = searchParams.get('q') || "";

    const [filters, setFilters] = useState<Filters>({
        search: initialSearch,
        categories: [],
        price: [0, 10000],
        verified: false,
    });
    const [sortBy, setSortBy] = useState<string>("newest");

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Replace with your actual API endpoint
                const res = await fetch('/api/categories');
                if (!res.ok) throw new Error('Failed to fetch categories');
                const data: Category[] = await res.json();
                setCategories(data);
            } catch (err) {
                console.warn("API call for categories failed, falling back to mock data.", err);
                setCategories(mockCategories);
            }
        };
        fetchCategories();
    }, []);

    // Update URL when search filter changes
    useEffect(() => {
        if (filters.search) {
            setSearchParams({ q: filters.search }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    }, [filters.search, setSearchParams]);

    // Fetch items when filters or sortBy change
    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (filters.search) params.append('q', filters.search);
                if (filters.categories.length > 0) params.append('categories', filters.categories.join(','));
                params.append('minPrice', filters.price[0].toString());
                params.append('maxPrice', filters.price[1].toString());
                if (filters.verified) params.append('verified', 'true');
                params.append('sortBy', sortBy);

                // Replace with your actual API endpoint
                const res = await fetch(`/api/items?${params.toString()}`);
                if (!res.ok) throw new Error(`Failed to fetch items. Status: ${res.status}`);
                const data: Item[] = await res.json();
                setItems(data);
            } catch (err) {
                console.warn("API call for items failed, falling back to mock data.", err);
                setError(null); // Clear error to avoid showing error message
                // Filter mock items based on current filters for a realistic fallback
                setItems(filterMockItems(filters, sortBy));
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce the fetch call to avoid too many requests while typing
        const timerId = setTimeout(() => {
            fetchItems();
        }, 300);

        return () => clearTimeout(timerId);
    }, [filters, sortBy]);

    // Helper function to filter mock data for fallback
    const filterMockItems = (currentFilters: Filters, currentSortBy: string) => {
        const q = currentFilters.search.trim().toLowerCase();
        let filtered = (q ? mockItems.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.category.name.toLowerCase().includes(q) ||
            item.seller.name.toLowerCase().includes(q)
        ) : mockItems).filter(item => {
            const categoryMatch = currentFilters.categories.length === 0 || currentFilters.categories.includes(item.category.id);
            const priceMatch = item.price >= currentFilters.price[0] && item.price <= currentFilters.price[1];
            const verifiedMatch = !currentFilters.verified || item.isVerified;
            return categoryMatch && priceMatch && verifiedMatch;
        });

        switch (currentSortBy) {
            case "price-asc": filtered.sort((a, b) => a.price - b.price); break;
            case "price-desc": filtered.sort((a, b) => b.price - a.price); break;
            case "newest": filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        }
        return filtered;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">All Products</h1>
                <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">Browse, filter, and find exactly what you're looking for.</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Filters */}
                <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
                    <div className="sticky top-24 space-y-6">
                        <FiltersSidebar filters={filters} setFilters={setFilters} categories={categories} />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="w-full lg:w-3/4 xl:w-4/5">
                    {/* Header with Search, Sort, and Mobile Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 p-4 border rounded-lg bg-card">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products, categories..."
                                className="pl-10"
                                value={filters.search}
                                onChange={handleSearchChange} />
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                </SelectContent>
                            </Select>
                            {/* Mobile Filter Drawer */}
                            <Drawer>
                                <DrawerTrigger asChild className="lg:hidden">
                                    <Button variant="outline" size="icon"><Filter className="h-5 w-5" /></Button>
                                </DrawerTrigger>
                                <DrawerContent className="p-4 h-[80vh]">
                                    <div className="overflow-y-auto">
                                        <FiltersSidebar filters={filters} setFilters={setFilters} categories={categories} />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <AnimatePresence>
                        <motion.div
                            layout
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {isLoading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <motion.div layout key={`skeleton-${i}`} variants={itemVariants}>
                                        <ProductCardSkeleton />
                                    </motion.div>
                                ))
                            ) : error ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-24 bg-destructive/10 text-destructive rounded-xl">
                                    <p className="text-xl font-semibold">Could not load products</p>
                                    <p className="text-sm mt-2">{error}</p>
                                </motion.div>
                            ) : items.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-24 bg-muted/50 rounded-xl">
                                    <Frown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-xl font-semibold">No products found for "{filters.search}"</p>
                                    <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                                </motion.div>
                            ) : (
                                items.map(item => (
                                    <motion.div layout key={item.id} variants={itemVariants}>
                                        <ProductCard
                                            query={filters.search}
                                            item={item}
                                        />
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

const commonQuestions = [
    "Is this still available?",
    "Is the price negotiable?",
    "What is the condition of the item?",
    "Can you provide more pictures?",
];

interface ContactSellerModalProps {
    seller: User;
    item: Item;
}

const ContactSellerModal = ({ seller, item }: ContactSellerModalProps) => {
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    if (!seller) return null;

    const handleSendMessage = () => {
        // TODO: Implement actual message sending logic
        console.log(`Sending message to ${seller.name}: "${message}" regarding "${item.title}"`);
        setIsOpen(false); // Close modal after sending
        setMessage(""); // Reset message
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline" className="shrink-0">
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Contact Seller</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Message {seller.name}</DialogTitle>
                    <DialogDescription>Ask a question about "{item.title}"</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Hi ${seller.name}, I'm interested in...`} rows={4} />
                    <div>
                        <p className="text-sm font-medium mb-2 text-muted-foreground">Or use a suggestion:</p>
                        <div className="flex flex-wrap gap-2">
                            {commonQuestions.map((q) => (<Button key={q} variant="outline" size="sm" onClick={() => setMessage(q)}>{q}</Button>))}
                        </div>
                    </div>
                </div>
                <DialogFooter><Button onClick={handleSendMessage} disabled={!message.trim()}>Send Message</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


interface Filters {
    search: string;
    categories: string[];
    price: [number, number];
    verified: boolean;
}

interface FiltersSidebarProps {
    filters: Filters;
    setFilters: Dispatch<SetStateAction<Filters>>;
    categories: Category[];
}
const FiltersSidebar = ({ filters, setFilters, categories }: FiltersSidebarProps): JSX.Element => {
    const handleCategoryChange = (categoryId: string) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter(c => c !== categoryId)
                : [...prev.categories, categoryId],
        }));
    };

    const clearFilters = () => {
        setFilters({ categories: [], price: [0, 10000], verified: false, search: "" } as Filters);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:text-primary">
                    Clear All
                </Button>
            </div>
            <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
                <AccordionItem value="category">
                    <AccordionTrigger className="text-base">Category</AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`cat-${cat.id}`}
                                    checked={filters.categories.includes(cat.id)}
                                    onCheckedChange={() => handleCategoryChange(cat.id)}
                                />
                                <Label htmlFor={`cat-${cat.id}`} className="font-normal">{cat.name}</Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                    <AccordionTrigger className="text-base">Price Range</AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <Slider
                            min={0} max={10000} step={100}
                            value={filters.price}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, price: value as [number, number] }))}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>₹{filters.price[0]}</span>
                            <span>₹{filters.price[1]}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="status">
                    <AccordionTrigger className="text-base">Status</AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="verified"
                                checked={filters.verified}
                                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verified: !!checked }))}
                            />
                            <Label htmlFor="verified" className="font-normal flex items-center gap-1">
                                <BadgeCheck className="h-4 w-4 text-blue-500" /> Verified Seller
                            </Label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

interface ProductCardProps {
    item: Item;
    query: string;
}

const ProductCard = ({ item, query }: ProductCardProps) => {
    const { seller, category } = item;
    const images = item.images.length > 0 ? item.images : [{ url: "" }];
    const [current, setCurrent] = useState(0);
    const [api, setApi] = useState<CarouselApi | null>(null);
    const plugin = useRef(Autoplay({ delay: 1000, stopOnInteraction: false, playOnInit: false }));
    const [autoPlayActive, setAutoPlayActive] = useState(false);

    // Only play/stop autoplay for this card
    useEffect(() => {
        if (!api) return;
        if (autoPlayActive) {
            plugin.current.play();
        } else {
            plugin.current.stop();
        }
    }, [autoPlayActive, api]);

    // Keep current index in sync with carousel
    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => setCurrent(api.selectedScrollSnap()));
    }, [api]);

    // Manual navigation disables autoplay for this card
    const handleManualNav = (idx: number) => {
        setAutoPlayActive(false);
        api?.scrollTo(idx);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAutoPlayActive(false);
        api?.scrollPrev();
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAutoPlayActive(false);
        api?.scrollNext();
    };

    return (
        <Card className="relative w-full overflow-hidden group border border-muted bg-background/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-xl p-0">
            <CardContent className="p-0">
                <div
                    className="aspect-square overflow-hidden relative group"
                    onMouseEnter={() => setAutoPlayActive(true)}
                    onMouseLeave={() => setAutoPlayActive(false)}
                >
                    <Carousel
                        setApi={setApi}
                        plugins={[plugin.current]}
                        opts={{ loop: true }}
                    >
                        <CarouselContent>
                            {images.map((img, i) => (
                                <CarouselItem key={i}>
                                    <img
                                        src={img.url}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-300"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {images.length > 1 && (
                            <>
                                <CarouselPrevious
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={handlePrev}
                                />
                                <CarouselNext
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={handleNext}
                                />
                            </>
                        )}
                        {images.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {images.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`inline-block w-2 h-2 rounded-full transition-all duration-200 ${current === i ? "bg-primary" : "bg-muted-foreground/40"}`}
                                        style={{ opacity: current === i ? 1 : 0.6 }}
                                        onClick={e => { e.stopPropagation(); handleManualNav(i); }}
                                    />
                                ))}
                            </div>
                        )}
                    </Carousel>
                    <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {category?.name || 'Uncategorized'}
                    </span>
                    {item.isVerified && (
                        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
                            <BadgeCheck className="h-5 w-5 text-blue-500" />
                        </div>
                    )}
                    {Date.now() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 * 24 * 7 && (
                        <span className="absolute bottom-2 left-2 bg-green-500/90 text-white/95 text-xs font-semibold px-2 py-0.5 rounded shadow">
                            New
                        </span>
                    )}
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Link to={`/user/${seller?.id}`} className="shrink-0">
                            <Avatar className="h-9 w-9 border-2 border-primary/30 shadow">
                                <AvatarImage src={seller?.avatar || ''} alt={seller?.name} />
                                <AvatarFallback>{seller?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base leading-snug truncate group-hover:text-primary transition-colors">
                                {highlightText(item.title, query)}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">{seller?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-lg font-bold text-primary">₹{item.price.toLocaleString()}</p>
                        <ContactSellerModal seller={seller} item={item} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const ProductCardSkeleton = () => (
    <Card className="w-full overflow-hidden rounded-xl p-0">
        <CardContent className="p-0">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
        </CardContent>
    </Card>
);