import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { BadgeCheck, Filter, MessageSquare, Search, Frown } from "lucide-react";
import { useEffect, useRef, useState, useMemo, type Dispatch, type JSX, type SetStateAction, type ReactNode } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCategories, useSearchItems } from "@/hooks/api";
import { chatService } from "@/services/chat.service";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";

// Type definitions
interface Category {
  id: string;
  name: string;
}

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

interface Filters {
  search: string;
  categories: string[];
  price: [number, number];
  verified: boolean;
  hideSold: boolean;
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
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!seller) return null;

  const handleSendMessage = async () => {
    if (!user) {
      toast.error('Please log in to contact the seller');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      // Create or get existing chat with the seller
      const chatResponse = await chatService.createOrGetChat(seller.id);
      const chatId = chatResponse.data?.chat?.id || chatResponse.data?.id;

      if (!chatId) {
        throw new Error('Failed to create chat');
      }

      // capture the message locally to avoid race with setState
      const payload = message;
      toast.success('Chat created! Redirecting to messages...');
      setIsOpen(false);
      setMessage("");

      // Navigate to chat with the message ready
      navigate(`/chat/${chatId}?message=${encodeURIComponent(payload)}`);
    } catch (error: any) {
      console.error('Failed to contact seller:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
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
          <Textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder={`Hi ${seller.name}, I'm interested in...`} 
            rows={4} 
          />
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">Or use a suggestion:</p>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.map((q) => (
                <Button key={q} variant="outline" size="sm" onClick={() => setMessage(q)}>
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSendMessage} disabled={!message.trim() || isSending}>
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
    setFilters({ categories: [], price: [0, 10000], verified: false, search: "", hideSold: true } as Filters);
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
              min={0} 
              max={10000} 
              step={100}
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hideSold"
                checked={filters.hideSold}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hideSold: !!checked }))}
              />
              <Label htmlFor="hideSold" className="font-normal">
                Hide Sold Items
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
  const images = useMemo(() => 
    item.images.length > 0 ? item.images : [{ url: "" }], 
    [item.images]
  );
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  // typed as any to be safe with the plugin shape; guard calls with optional chaining
  const plugin = useRef<any>(Autoplay({ delay: 1000, stopOnInteraction: false, playOnInit: false }));
  const [autoPlayActive, setAutoPlayActive] = useState(false);
  const navigate = useNavigate();
  
  const isNew = useMemo(() => 
    Date.now() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 * 24 * 7,
    [item.createdAt]
  );

  // Only play/stop autoplay for this card
  useEffect(() => {
    if (!api || !plugin.current) return;
    if (autoPlayActive) {
      // guard methods in case plugin implementation differs
      if (plugin.current?.play) plugin.current.play();
    } else {
      if (plugin.current?.stop) plugin.current.stop();
    }
  }, [autoPlayActive, api]);

  // Keep current index in sync with carousel
  useEffect(() => {
    if (!api) return;
    try {
      setCurrent(api.selectedScrollSnap());
      // ensure api.on exists before subscribing
      if (typeof api.on === "function") {
        const handler = () => setCurrent(api.selectedScrollSnap());
        api.on("select", handler);
        return () => {
          // try to cleanup gracefully
          if (typeof api.off === "function") api.off("select", handler);
        };
      }
    } catch (e) {
      // swallow any unexpected carousel api errors (fallback safe)
      console.warn("Carousel API subscription failed", e);
    }
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

  const handleCardClick = () => {
    if (!item.isSold) {
      navigate(`/items/${item.id}`);
    }
  };

  return (
    <Card 
      className={`relative w-full overflow-hidden group border border-muted bg-background/90 transition-all duration-300 rounded-xl p-0 ${
        item.isSold 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
      }`}
      onClick={handleCardClick}
      role="button"
      tabIndex={item.isSold ? -1 : 0}
      aria-label={`View details for ${item.title}${item.isSold ? ' (Sold)' : ''}`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !item.isSold) {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
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
                    src={img.url || '/placeholder-500.png'} // safe placeholder if url empty
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
                    className={`inline-block w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${current === i ? "bg-primary" : "bg-muted-foreground/40"}`}
                    style={{ opacity: current === i ? 1 : 0.6 }}
                    onClick={(e) => { e.stopPropagation(); handleManualNav(i); }}
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
          {isNew && (
            <span className="absolute bottom-2 left-2 bg-green-500/90 text-white/95 text-xs font-semibold px-2 py-0.5 rounded shadow">
              New
            </span>
          )}
          {item.isSold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-lg">
                SOLD
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Link 
              to={`/user/${seller?.id}`} 
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="h-9 w-9 border-2 border-primary/30 shadow">
                <AvatarImage src={seller?.avatar || ''} alt={seller?.name} />
                <AvatarFallback>{seller?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-base leading-snug truncate transition-colors ${
                item.isSold ? 'text-muted-foreground' : 'group-hover:text-primary'
              }`}>
                {highlightText(item.title, query)}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{seller?.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className={`text-lg font-bold ${item.isSold ? 'text-muted-foreground line-through' : 'text-primary'}`}>
              ₹{item.price.toLocaleString()}
            </p>
            {!item.isSold && (
              <div onClick={(e) => e.stopPropagation()}>
                <ContactSellerModal seller={seller} item={item} />
              </div>
            )}
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

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || "";

  const [filters, setFilters] = useState<Filters>({
    search: initialSearch,
    categories: [],
    price: [0, 10000],
    verified: false,
    hideSold: true,
  });
  const [sortBy, setSortBy] = useState<string>("newest");

  // Map sortBy values to API format
  const mapSortBy = (sort: string): { sortBy: 'price' | 'createdAt', sortOrder: 'asc' | 'desc' } => {
    switch (sort) {
      case "price-asc": return { sortBy: 'price', sortOrder: 'asc' };
      case "price-desc": return { sortBy: 'price', sortOrder: 'desc' };
      case "newest": return { sortBy: 'createdAt', sortOrder: 'desc' };
      default: return { sortBy: 'createdAt', sortOrder: 'desc' };
    }
  };

  const { sortBy: apiSortBy, sortOrder } = mapSortBy(sortBy);

  // Use API hooks
  const { data, isLoading: categoriesLoading } = useCategories();
  const {
    data: itemsData,
    isLoading: itemsLoading,
    error: itemsError
  } = useSearchItems({
    q: filters.search,
    category: filters.categories.length > 0 ? filters.categories[0] : undefined,
    minPrice: filters.price[0],
    maxPrice: filters.price[1],
    sortBy: apiSortBy,
    sortOrder: sortOrder
  });

  const allItems = useMemo(() => itemsData?.items || [], [itemsData?.items]);
  const items = useMemo(() => 
    filters.hideSold ? allItems.filter(item => !item.isSold) : allItems,
    [allItems, filters.hideSold]
  );
  const isLoading = categoriesLoading || itemsLoading;
  const error = itemsError ? 'Failed to load items' : null;

  // Update URL when search filter changes
  useEffect(() => {
    if (filters.search) {
      setSearchParams({ q: filters.search }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [filters.search, setSearchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-20 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">All Products</h1>
          <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
            Browse, filter, and find exactly what you're looking for.
          </p>
        </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
          <div className="sticky top-24 space-y-6">
            <FiltersSidebar filters={filters} setFilters={setFilters} categories={data?.categories || []} />
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
                onChange={handleSearchChange} 
              />
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
                  <Button variant="outline" size="icon">
                    <Filter className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="p-4 h-[80vh]">
                  <div className="overflow-y-auto">
                    <FiltersSidebar filters={filters} setFilters={setFilters} categories={data?.categories || []} />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>

          {/* Results Count */}
          {!isLoading && (
            <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
              <span>
                {items.length === 0 ? 'No' : items.length} of {allItems.length} product{allItems.length !== 1 ? 's' : ''}
                {filters.search && ` for "${filters.search}"`}
              </span>
              {filters.hideSold && allItems.length > items.length && (
                <span className="text-xs">
                  ({allItems.length - items.length} sold item{allItems.length - items.length !== 1 ? 's' : ''} hidden)
                </span>
              )}
            </div>
          )}

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
                Array.from({ length: 12 }).map((_, i) => (
                  <motion.div layout key={`skeleton-${i}`} variants={itemVariants}>
                    <ProductCardSkeleton />
                  </motion.div>
                ))
              ) : error ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full text-center py-24 bg-destructive/10 text-destructive rounded-xl"
                >
                  <Frown className="w-16 h-16 mx-auto text-destructive mb-4" />
                  <p className="text-xl font-semibold">Could not load products</p>
                  <p className="text-sm mt-2">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()} 
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </motion.div>
              ) : allItems.length === 0 && filters.search ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full text-center py-24 bg-muted/50 rounded-xl"
                >
                  <Frown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-xl font-semibold">No products found for "{filters.search}"</p>
                  <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters(prev => ({ ...prev, search: "" }))} 
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </motion.div>
              ) : items.length === 0 && filters.hideSold ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full text-center py-24 bg-muted/50 rounded-xl"
                >
                  <Frown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-xl font-semibold">All items matching your criteria are sold</p>
                  <p className="text-muted-foreground mt-2">Try showing sold items or adjusting your filters.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters(prev => ({ ...prev, hideSold: false }))} 
                    className="mt-4"
                  >
                    Show Sold Items
                  </Button>
                </motion.div>
              ) : items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full text-center py-24 bg-muted/50 rounded-xl"
                >
                  <Frown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-xl font-semibold">No products available</p>
                  <p className="text-muted-foreground mt-2">Check back later for new listings.</p>
                </motion.div>
              ) : (
                items.map((item: any) => (
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
    </div>
  );
};