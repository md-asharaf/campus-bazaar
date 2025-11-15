import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMyItems } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Package,
  Heart,
  MessageSquare,
  Settings,
  Edit3,
  Plus,
  BadgeCheck,
  Clock,
  Eye,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Cookies from 'js-cookie';
import type { User as UserType, ApiResponse } from '@/types';
import { getMe } from '@/services/profile.service';
import { handleGoogleCallback } from '@/services/auth.service';

/**
 * Dashboard page
 *
 * Added Google OAuth token handling:
 * - On first mount, if accessToken / refreshToken are present in URL query, persist them to cookies
 * - Scrub tokens from URL to avoid exposing them
 * - If only an OAuth 'code' param exists (backend used authorization code flow without embedding tokens), call handleGoogleCallback(code)
 * - After persisting tokens, fetch /users/me and update auth context via login()
 *
 * This complements the AuthProvider's initial fetch but ensures direct redirects to /dashboard?accessToken=... are handled immediately.
 */

export function Dashboard() {
  const { user, loading: authLoading, login } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const oauthHandledRef = useRef(false);

  // Attempt immediate OAuth token capture / code exchange if user not yet loaded
  useEffect(() => {
    if (oauthHandledRef.current) return;
    if (user) {
      // Already authenticated; no need to process tokens
      oauthHandledRef.current = true;
      return;
    }

    let modified = false;
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('accessToken');
    const refreshToken = url.searchParams.get('refreshToken');
    const code = url.searchParams.get('code');

    const persistTokens = (at?: string | null, rt?: string | null) => {
      if (at) {
        Cookies.set('user_accessToken', at, {
          path: '/',
          sameSite: 'lax',
          secure: true,
          expires: 1 / (24 * 4), // ~15 minutes
        });
      }
      if (rt) {
        Cookies.set('user_refreshToken', rt, {
          path: '/',
          sameSite: 'lax',
          secure: true,
          expires: 7, // 7 days
        });
      }
    };

    const scrubTokenParams = () => {
      if (url.searchParams.has('accessToken')) {
        url.searchParams.delete('accessToken');
        modified = true;
      }
      if (url.searchParams.has('refreshToken')) {
        url.searchParams.delete('refreshToken');
        modified = true;
      }
      if (url.searchParams.has('code')) {
        // If a code param was used just for immediate exchange, we can safely remove it
        url.searchParams.delete('code');
        modified = true;
      }
      if (modified) {
        const newUrl = url.pathname + (url.search ? url.search : '') + url.hash;
        window.history.replaceState({}, '', newUrl);
      }
    };

    const finalize = () => {
      oauthHandledRef.current = true;
    };

    (async () => {
      try {
        // Case 1: Tokens directly in URL
        if (accessToken) {
          persistTokens(accessToken, refreshToken);
          scrubTokenParams();
          // Fetch user immediately
          const res: ApiResponse<{ user: UserType }> = await getMe();
          if (res?.data?.user) {
            login(res.data.user);
          }
          finalize();
          return;
        }

        // Case 2: Authorization code - perform backend callback flow
        if (code) {
          try {
            await handleGoogleCallback(code);
            // Tokens should now be in cookies; scrub code param
            scrubTokenParams();
            const res: ApiResponse<{ user: UserType }> = await getMe();
            if (res?.data?.user) {
              login(res.data.user);
            }
          } catch (err) {
            console.error('Google callback handling failed:', err);
          } finally {
            finalize();
          }
          return;
        }

        // Nothing to handle
        finalize();
      } catch (e) {
        console.error('OAuth handling failed:', e);
        finalize();
      }
    })();
  }, [user, login]);

  const { data, isLoading: itemsLoading } = useMyItems({
    enabled: activeTab === 'overview' || activeTab === 'items'
  });

  useEffect(() => {
    // Add a small delay before redirecting to prevent flash
    if (!authLoading && !user) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 100);
      return () => clearTimeout(timer);
    } else if (user) {
      setShouldRedirect(false);
    }
  }, [authLoading, user]);

  // Show loading while authentication is being checked
  if (authLoading) {
    return <DashboardSkeleton />;
  }

  // Redirect to login if not authenticated
  if (shouldRedirect) {
    return <Navigate to="/student-login" replace />;
  }

  if (!user) {
    return <DashboardSkeleton />;
  }

  const currentUser = user;
  const items = data?.items || [];

  const stats = {
    totalItems: items.length,
    activeItems: items?.filter(item => !item.isSold).length,
    soldItems: items?.filter(item => item.isSold).length,
    totalViews: items?.reduce((sum) => sum + (Math.random() * 15), 0),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-primary/20">
                    <AvatarImage src={currentUser?.avatar || ''} alt={currentUser?.name} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-foreground">
                        Welcome back, {currentUser?.name?.split(' ')[0]}!
                      </h1>
                      {currentUser?.isVerified && (
                        <BadgeCheck className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {currentUser?.branch} • Year {currentUser?.year}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link to="/sell">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Sell Item
                    </Button>
                  </Link>
                  <Link to="/profile/edit">
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          {/* Verification Alert */}
          {!currentUser?.isVerified && (
            <Card className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <CardContent className="flex items-center gap-4 p-4">
                <Clock className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                    Verification Pending
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-200">
                    Complete your profile verification to start selling items and build trust.
                  </p>
                </div>
                <Link to="/verify">
                  <Button variant="outline" size="sm" className="border-orange-300">
                    Verify Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Items"
              value={stats.totalItems}
              icon={<Package className="h-5 w-5" />}
              color="bg-blue-500"
            />
            <StatsCard
              title="Active Items"
              value={stats.activeItems}
              icon={<Eye className="h-5 w-5" />}
              color="bg-green-500"
            />
            <StatsCard
              title="Sold Items"
              value={stats.soldItems}
              icon={<BadgeCheck className="h-5 w-5" />}
              color="bg-purple-500"
            />
            <StatsCard
              title="Total Views"
              value={stats.totalViews}
              icon={<Eye className="h-5 w-5" />}
              color="bg-orange-500"
            />
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="items">My Items</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Items */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Items</CardTitle>
                    <Link to="/dashboard?tab=items">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {itemsLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <ItemSkeleton key={i} />
                      ))
                    ) : items.slice(0, 3).length > 0 ? (
                      items.slice(0, 3).map(item => (
                        <ItemRow key={item.id} item={item} />
                      ))
                    ) : (
                      <EmptyState
                        icon={<Package className="h-8 w-8 text-muted-foreground" />}
                        title="No items yet"
                        description="Start selling by adding your first item"
                        action={
                          <Link to="/sell">
                            <Button size="sm">Add Item</Button>
                          </Link>
                        }
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ActionButton
                      icon={<Plus className="h-4 w-4" />}
                      label="Sell New Item"
                      description="List something for sale"
                      href="/sell"
                    />
                    <ActionButton
                      icon={<Heart className="h-4 w-4" />}
                      label="View Wishlist"
                      description="Items you want to buy"
                      href="/wishlist"
                    />
                    <ActionButton
                      icon={<MessageSquare className="h-4 w-4" />}
                      label="Messages"
                      description="Chat with buyers and sellers"
                      href="/messages"
                    />
                    <ActionButton
                      icon={<User className="h-4 w-4" />}
                      label="Edit Profile"
                      description="Update your information"
                      href="/profile/edit"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="items" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Items ({items.length})</h2>
                <Link to="/sell">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Item
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itemsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <ItemCardSkeleton key={i} />
                  ))
                ) : items.length > 0 ? (
                  items.map(item => (
                    <ItemCard key={item.id} item={item} />
                  ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState
                      icon={<Package className="h-12 w-12 text-muted-foreground" />}
                      title="No items listed"
                      description="You haven't listed any items yet. Start by adding your first item."
                      action={
                        <Link to="/sell">
                          <Button>Add Your First Item</Button>
                        </Link>
                      }
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-6">
              <WishlistTab />
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <MessagesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Components
function StatsCard({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color} text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ItemRow({ item }: { item: any }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <img
        src={item.images?.[0]?.url || '/placeholder-item.jpg'}
        alt={item.title}
        className="w-10 h-10 rounded object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.title}</p>
        <p className="text-sm text-muted-foreground">₹{item.price}</p>
      </div>
      <Badge variant={item.isSold ? 'secondary' : 'default'} className="text-xs">
        {item.isSold ? 'Sold' : 'Active'}
      </Badge>
    </div>
  );
}

function ItemCard({ item }: { item: any }) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={item.images?.[0]?.url || '/placeholder-item.jpg'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {item.isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge className="bg-white text-black">Sold</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{item.title}</h3>
            <p className="text-lg font-bold text-primary">₹{item.price}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/items/${item.id}/edit`}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionButton({ icon, label, description, href }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link to={href}>
      <Button variant="ghost" className="w-full h-auto p-4 justify-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <div className="text-left">
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Button>
    </Link>
  );
}

function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
}

function WishlistTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Wishlist</h2>
      <EmptyState
        icon={<Heart className="h-12 w-12 text-muted-foreground" />}
        title="Your wishlist is empty"
        description="Items you save for later will appear here"
        action={
          <Link to="/items">
            <Button>Browse Items</Button>
          </Link>
        }
      />
    </div>
  );
}

function MessagesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Link to="/messages">
          <Button variant="outline">View All</Button>
        </Link>
      </div>
      <EmptyState
        icon={<MessageSquare className="h-12 w-12 text-muted-foreground" />}
        title="No messages yet"
        description="Your conversations with buyers and sellers will appear here"
        action={
          <Link to="/items">
            <Button>Start Shopping</Button>
          </Link>
        }
      />
    </div>
  );
}

// Skeleton Components
function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );
}

function ItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="h-10 w-10 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-12" />
    </div>
  );
}

function ItemCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-square rounded-t-lg" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </CardContent>
    </Card>
  );
}