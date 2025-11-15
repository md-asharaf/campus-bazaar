import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useWishlistItems, useRemoveFromWishlist } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Heart,
  HeartOff,
  MessageSquare,
  Share2,
  MoreVertical,
  Clock,
  BadgeCheck,
  ShoppingCart,
  Filter,
  Grid,
  List,
  ArrowUpDown
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'title';

export function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const { items: wishlistItems, isLoading, count } = useWishlistItems();
  const removeFromWishlist = useRemoveFromWishlist();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [contactItem, setContactItem] = useState<any>(null);
  const [message, setMessage] = useState('');

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/student-login?from=/wishlist" replace />;
  }

  if (authLoading || isLoading) {
    return <WishlistSkeleton viewMode={viewMode} />;
  }

  // Sort and filter items
  const sortedItems = [...(wishlistItems || [])].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.addedToWishlistAt || b.createdAt).getTime() - new Date(a.addedToWishlistAt || a.createdAt).getTime();
      case 'oldest':
        return new Date(a.addedToWishlistAt || a.createdAt).getTime() - new Date(b.addedToWishlistAt || b.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const filteredItems = selectedCategory === 'all'
    ? sortedItems
    : sortedItems.filter(item => item.category?.name === selectedCategory);

  const categories = Array.from(new Set(wishlistItems?.map(item => item.category?.name).filter(Boolean)));

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await removeFromWishlist.mutateAsync(itemId);
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const handleContactSeller = () => {
    if (!user || !contactItem) return;

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // TODO: Implement actual message sending
    console.log('Sending message:', message, 'to seller of', contactItem.title);
    toast.success('Message sent successfully!');
    setContactItem(null);
    setMessage('');
  };

  const handleShare = async (item: any) => {
    const url = `${window.location.origin}/items/${item.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out this item: ${item.title}`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {count > 0 ? `${count} saved items` : 'No saved items yet'}
              </p>
            </div>

            {/* Controls */}
            {count > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Category Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-1 border rounded-md text-sm bg-background"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="px-3 py-1 border rounded-md text-sm bg-background"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {filteredItems.length === 0 ? (
            <EmptyWishlist hasItems={count > 0} />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <WishlistItemCard
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemoveFromWishlist(item.id)}
                  onContact={() => setContactItem(item)}
                  onShare={() => handleShare(item)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <WishlistItemRow
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemoveFromWishlist(item.id)}
                  onContact={() => setContactItem(item)}
                  onShare={() => handleShare(item)}
                />
              ))}
            </div>
          )}

          {/* Contact Seller Dialog */}
          <Dialog open={!!contactItem} onOpenChange={(open) => !open && setContactItem(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact {contactItem?.seller?.name}</DialogTitle>
                <DialogDescription>
                  Send a message about "{contactItem?.title}"
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder={`Hi ${contactItem?.seller?.name}, I'm interested in your ${contactItem?.title}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button onClick={handleContactSeller} className="flex-1">
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => setContactItem(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

// Components
function WishlistItemCard({ item, onRemove, onContact, onShare }: {
  item: any;
  onRemove: () => void;
  onContact: () => void;
  onShare: () => void;
}) {
  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
      <Link to={`/items/${item.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.images?.[0]?.url || '/placeholder-item.jpg'}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {item.isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge className="bg-red-500 text-white">SOLD</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRemove} className="text-destructive">
                  <HeartOff className="h-4 w-4 mr-2" />
                  Remove from Wishlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <Link to={`/items/${item.id}`}>
              <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                {item.title}
              </h3>
            </Link>
            <p className="text-2xl font-bold text-primary mt-1">
              ₹{item.price.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {item.category && (
              <Badge variant="secondary" className="text-xs">
                {item.category.name}
              </Badge>
            )}
            {item.isVerified && (
              <BadgeCheck className="h-4 w-4 text-blue-500" />
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Saved {formatDistanceToNow(new Date(item.addedToWishlistAt || item.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <Link to={`/profile/${item.seller?.id}`} className="flex items-center gap-2 hover:opacity-80">
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.seller?.avatar} alt={item.seller?.name} />
                <AvatarFallback className="text-xs">
                  {item.seller?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {item.seller?.name}
              </span>
            </Link>
          </div>

          <Button
            size="sm"
            className="w-full"
            onClick={onContact}
            disabled={item.isSold}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {item.isSold ? 'Sold' : 'Contact Seller'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WishlistItemRow({ item, onRemove, onContact, onShare }: {
  item: any;
  onRemove: () => void;
  onContact: () => void;
  onShare: () => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Link to={`/items/${item.id}`} className="shrink-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={item.images?.[0]?.url || '/placeholder-item.jpg'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.isSold && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge className="bg-red-500 text-white text-xs">SOLD</Badge>
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Link to={`/items/${item.id}`}>
                  <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-2xl font-bold text-primary mt-1">
                  ₹{item.price.toLocaleString()}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  {item.category && (
                    <Badge variant="secondary" className="text-xs">
                      {item.category.name}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      Saved {formatDistanceToNow(new Date(item.addedToWishlistAt || item.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <Link to={`/profile/${item.seller?.id}`} className="flex items-center gap-2 mt-3 hover:opacity-80">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={item.seller?.avatar} alt={item.seller?.name} />
                    <AvatarFallback className="text-xs">
                      {item.seller?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {item.seller?.name}
                  </span>
                  {item.seller?.isVerified && (
                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                  )}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={onContact}
                  disabled={item.isSold}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {item.isSold ? 'Sold' : 'Contact'}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRemove} className="text-destructive">
                      <HeartOff className="h-4 w-4 mr-2" />
                      Remove from Wishlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyWishlist({ hasItems }: { hasItems: boolean }) {
  return (
    <div className="text-center py-12">
      <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold mb-2">
        {hasItems ? 'No items match your filters' : 'Your wishlist is empty'}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        {hasItems
          ? 'Try adjusting your category or sort filters to see more items.'
          : 'Start browsing items and save the ones you like to see them here.'
        }
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/items">
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Browse Items
          </Button>
        </Link>
        {hasItems && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}

function WishlistSkeleton({ viewMode }: { viewMode: ViewMode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-20 h-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}