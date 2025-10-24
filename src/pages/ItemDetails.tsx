import { useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useItem } from '@/hooks/api';
import { useAuth } from '@/hooks/useAuth';
import { chatService } from '@/services/chat.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  BadgeCheck,
  Clock,
  Eye,
  Flag,
  Star,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export function ItemDetails() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: item, isLoading, isError, error } = useItem(itemId!);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const [message, setMessage] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  if (!itemId) {
    return <Navigate to="/items" replace />;
  }

  if (isLoading) {
    return <ItemDetailsSkeleton />;
  }

  if (isError || !item) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-center py-8 flex-1">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Item not found</h2>
            <p className="text-muted-foreground">
              {error?.message || 'The item you are looking for does not exist.'}
            </p>
            <Link to="/items">
              <Button>Browse Items</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = item.images && item.images.length > 0
    ? item.images
    : [{ url: '/placeholder-item.jpg' }];

  const handleContactSeller = async () => {
    if (!user) {
      toast.error('Please log in to contact the seller');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    if (!item?.sellerId) {
      toast.error('Unable to contact seller at this time');
      return;
    }

    setIsSendingMessage(true);
    try {
      // Create or get existing chat with the seller
      const chatResponse = await chatService.createOrGetChat(item.sellerId);
      const chatId = chatResponse.data?.chat?.id || chatResponse.data?.id;

      if (!chatId) {
        throw new Error('Failed to create chat');
      }

      // Send the message (using the existing sendMessage method from socket or direct API)
      // For now, we'll navigate to the chat with the pre-filled message
      toast.success('Chat created! Redirecting to messages...');
      setMessage('');
      setIsContactOpen(false);

      // Navigate to chat with the message ready
      navigate(`/chat/${chatId}?message=${encodeURIComponent(message)}`);
    } catch (error: any) {
      console.error('Failed to contact seller:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error('Please log in to save items to wishlist');
      return;
    }
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    const url = window.location.href;
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
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const isOwnItem = user?.id === item.sellerId;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background flex-1">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/items">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <nav className="text-sm text-muted-foreground">
            <Link to="/items" className="hover:text-foreground">Items</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{item.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <img
                src={images[selectedImageIndex]?.url || images[0]?.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.isSold && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                    SOLD
                  </Badge>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground'
                      }`}
                  >
                    <img
                      src={image.url}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {item.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    {item.category && (
                      <Badge variant="secondary">{item.category.name}</Badge>
                    )}
                    {item.isVerified && (
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        <BadgeCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {!item.isSold && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Available
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={isWishlist ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 ${isWishlist ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-4xl font-bold text-primary mb-6">
                ₹{item.price.toLocaleString()}
              </div>

              {/* Item Meta Info */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {Math.random() * 15 || 0} views
                </div>
              </div>
            </div>

            <Separator />

            {/* Seller Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seller Information</h3>
              <div className="flex items-center justify-between">
                <Link to={`/profile/${item.seller?.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.seller?.avatar || ''} alt={item.seller?.name} />
                    <AvatarFallback>{item.seller?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.seller?.name}</p>
                      {item.seller?.isVerified && (
                        <BadgeCheck className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.seller?.branch} • Year {item.seller?.year}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>4.8 (23 reviews)</span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${item.seller?.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isOwnItem && !item.isSold && (
                <>
                  <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Seller
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact {item.seller?.name}</DialogTitle>
                        <DialogDescription>
                          Send a message about "{item.title}"
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder={`Hi ${item.seller?.name}, I'm interested in your ${item.title}...`}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleContactSeller} className="flex-1" disabled={isSendingMessage}>
                            {isSendingMessage ? 'Sending...' : 'Send Message'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsContactOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Quick Message Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setMessage("Is this item still available?");
                      setIsContactOpen(true);
                    }}>
                      Is this available?
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setMessage("Is the price negotiable?");
                      setIsContactOpen(true);
                    }}>
                      Negotiate price?
                    </Button>
                  </div>
                </>
              )}

              {isOwnItem && (
                <div className="grid grid-cols-2 gap-3">
                  <Link to={`/items/${item.id}/edit`}>
                    <Button variant="outline" className="w-full">
                      Edit Item
                    </Button>
                  </Link>
                  <Button
                    variant={item.isSold ? "secondary" : "default"}
                    className="w-full"
                    disabled={item.isSold}
                  >
                    {item.isSold ? "Sold" : "Mark as Sold"}
                  </Button>
                </div>
              )}

              {item.isSold && !isOwnItem && (
                <Button disabled className="w-full" variant="secondary">
                  This item is sold
                </Button>
              )}
            </div>

            {/* Safety Tips */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Safety Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Meet in a public place on campus</li>
                  <li>• Inspect the item before paying</li>
                  <li>• Use campus-approved payment methods</li>
                  <li>• Report any suspicious activity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Items */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More from this seller</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related items */}
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="group hover:shadow-md transition-shadow">
                <div className="aspect-square bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">Loading...</h3>
                  <p className="text-primary font-bold">₹---</p>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Component
function ItemDetailsSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background flex-1">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 rounded" />
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}