import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Calendar,
  Star,
  MessageSquare,
  BadgeCheck,
  Flag,
  Share2,
  Package,
  Clock,
  GraduationCap,
  Grid,
  List
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// Mock data - replace with actual API calls
const mockUser = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@kist.edu.np',
  avatar: 'https://i.pravatar.cc/150?u=john',
  bio: 'Final year Computer Science student passionate about technology and entrepreneurship. Selling quality items at fair prices.',
  phone: '+977-9841234567',
  branch: 'Computer Science and Engineering',
  year: 4,
  registrationNo: 'CSE2020001',
  isVerified: true,
  isActive: true,
  createdAt: '2023-01-15T00:00:00Z',
  rating: 4.8,
  reviewCount: 23,
  totalItems: 15,
  soldItems: 12,
  activeItems: 3,
};

const mockItems = Array.from({ length: 12 }, (_, i) => ({
  id: `item-${i + 1}`,
  title: `Item ${i + 1}`,
  price: Math.floor(Math.random() * 10000) + 500,
  images: [{ url: `https://picsum.photos/seed/item${i}/300/300` }],
  category: { name: ['Electronics', 'Books', 'Furniture', 'Clothing'][i % 4] },
  isVerified: Math.random() > 0.3,
  isSold: Math.random() > 0.7,
  createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
}));

const mockReviews = [
  {
    id: '1',
    rating: 5,
    comment: 'Great seller! Item was exactly as described and delivery was prompt.',
    reviewerName: 'Alice Johnson',
    reviewerAvatar: 'https://i.pravatar.cc/40?u=alice',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    rating: 5,
    comment: 'Honest and reliable. Would definitely buy again!',
    reviewerName: 'Bob Wilson',
    reviewerAvatar: 'https://i.pravatar.cc/40?u=bob',
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '3',
    rating: 4,
    comment: 'Good communication and fair pricing.',
    reviewerName: 'Carol Davis',
    reviewerAvatar: 'https://i.pravatar.cc/40?u=carol',
    createdAt: '2023-12-20T00:00:00Z',
  },
];

export function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('items');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [itemFilter, setItemFilter] = useState<'all' | 'active' | 'sold'>('all');
  const [message, setMessage] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // In real app, fetch user data based on userId
  const profileUser = mockUser;
  const isOwnProfile = currentUser?.id === userId;

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">User not found</h2>
          <p className="text-muted-foreground">
            The user profile you are looking for does not exist.
          </p>
          <Link to="/items">
            <Button>Browse Items</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredItems = mockItems.filter(item => {
    if (itemFilter === 'active') return !item.isSold;
    if (itemFilter === 'sold') return item.isSold;
    return true;
  });

  const handleContactUser = () => {
    if (!currentUser) {
      toast.error('Please log in to contact users');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsLoading(true);
    // TODO: Implement actual message sending
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Message sent successfully!');
      setIsContactOpen(false);
      setMessage('');
    }, 1000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileUser.name}'s Profile - Campus Bazaar`,
          text: `Check out ${profileUser.name}'s profile on Campus Bazaar`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <span className="text-foreground">{profileUser.name}'s Profile</span>
          </nav>
        </div>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
                  <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
                  <AvatarFallback className="text-2xl">
                    {profileUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(profileUser.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {profileUser.rating} ({profileUser.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                      {profileUser.isVerified && (
                        <BadgeCheck className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{profileUser.bio}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{profileUser.branch}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Year {profileUser.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Joined {formatDistanceToNow(new Date(profileUser.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{profileUser.totalItems} items listed</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{profileUser.soldItems}</div>
                    <div className="text-sm text-muted-foreground">Sold</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{profileUser.activeItems}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{profileUser.rating}</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>

                {/* Actions */}
                {!isOwnProfile && (
                  <div className="flex gap-3">
                    <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact {profileUser.name.split(' ')[0]}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contact {profileUser.name}</DialogTitle>
                          <DialogDescription>
                            Send a message to {profileUser.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder={`Hi ${profileUser.name.split(' ')[0]}, I'm interested in...`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleContactUser} 
                              className="flex-1"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Sending...' : 'Send Message'}
                            </Button>
                            <Button variant="outline" onClick={() => setIsContactOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">Items ({filteredItems.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({profileUser.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {/* Items Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <select
                    value={itemFilter}
                    onChange={(e) => setItemFilter(e.target.value as any)}
                    className="px-3 py-1 border rounded-md text-sm bg-background"
                  >
                    <option value="all">All Items</option>
                    <option value="active">Active Only</option>
                    <option value="sold">Sold Only</option>
                  </select>
                </div>
              </div>

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

            {/* Items Grid/List */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground">
                  {itemFilter === 'all' 
                    ? `${profileUser.name} hasn't listed any items yet.`
                    : `No ${itemFilter} items found.`
                  }
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {mockReviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">
                  {profileUser.name} hasn't received any reviews yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Components
function ItemCard({ item }: { item: any }) {
  return (
    <Link to={`/items/${item.id}`}>
      <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.images[0]?.url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {item.isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge className="bg-red-500 text-white">SOLD</Badge>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {item.category.name}
            </Badge>
          </div>
          {item.isVerified && (
            <div className="absolute top-2 right-2">
              <BadgeCheck className="h-5 w-5 text-blue-500" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2">{item.title}</h3>
          <p className="text-2xl font-bold text-primary mb-2">
            ₹{item.price.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function ItemRow({ item }: { item: any }) {
  return (
    <Link to={`/items/${item.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
              <img
                src={item.images[0]?.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.isSold && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge className="bg-red-500 text-white text-xs">SOLD</Badge>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-1">{item.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">
                    ₹{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {item.category.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {item.isVerified && (
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ReviewCard({ review }: { review: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
            <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">{review.reviewerName}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}