import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminUsers, useAdminItems, useAdminVerifications, useAdminDashboardStats } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Package,
  BadgeCheck,
  Clock,
  Eye,
  MoreVertical,
  Ban,
  CheckCircle,
  XCircle,
  TrendingUp,

  ShoppingBag,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';



export function AdminDashboard() {
  const { admin, loading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userFilter, setUserFilter] = useState('all');
  const [itemFilter, setItemFilter] = useState('all');

  // Always load stats for overview tab
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();
  
  // Conditional API calls based on active tab
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ 
    limit: activeTab === 'overview' ? 5 : 20,
    enabled: activeTab === 'users' || activeTab === 'overview'
  });
  const { data: itemsData, isLoading: itemsLoading } = useAdminItems({ 
    limit: activeTab === 'overview' ? 5 : 20,
    enabled: activeTab === 'items' || activeTab === 'overview'
  });
  const { data: verificationsData, isLoading: verificationsLoading } = useAdminVerifications({
    status: 'PENDING',
    limit: activeTab === 'overview' ? 5 : 20,
    enabled: activeTab === 'verifications' || activeTab === 'overview'
  });

  if (loading || (activeTab === 'overview' && statsLoading)) {
    return <AdminDashboardSkeleton />;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  const handleUserAction = (_userId: string, action: string) => {
    toast.success(`User ${action} successfully`);
    // TODO: Implement actual user actions
  };

  const handleItemAction = (_itemId: string, action: string) => {
    toast.success(`Item ${action} successfully`);
    // TODO: Implement actual item actions
  };

  const handleVerificationAction = (_verificationId: string, action: string) => {
    toast.success(`Verification ${action} successfully`);
    // TODO: Implement actual verification actions
  };

  // Extract data from API responses
  const users = usersData?.data || [];
  const items = itemsData?.data || [];
  const verifications = verificationsData?.data || [];

  const filteredUsers = users.filter(user => {
    if (userFilter === 'verified') return user.isVerified;
    if (userFilter === 'unverified') return !user.isVerified;
    return true;
  });

  const filteredItems = items.filter(item => {
    if (itemFilter === 'verified') return item.isVerified;
    if (itemFilter === 'sold') return item.isSold;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage users, items, and platform operations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="verifications">
              Verifications
              {verifications.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {verifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon={<Users className="h-5 w-5" />}
                trend={`${stats?.itemGrowth && stats.itemGrowth > 0 ? '+' : ''}${stats?.itemGrowth || 0}%`}
                trendUp={stats?.itemGrowth ? stats.itemGrowth > 0 : false}
                color="bg-blue-500"
              />
              <StatsCard
                title="Active Items"
                value={stats?.totalItems || 0}
                icon={<Package className="h-5 w-5" />}
                trend={`${stats?.itemGrowth && stats.itemGrowth > 0 ? '+' : ''}${stats?.itemGrowth || 0}%`}
                trendUp={stats?.itemGrowth ? stats.itemGrowth > 0 : false}
                color="bg-green-500"
              />
              <StatsCard
                title="Pending Reviews"
                value={stats?.pendingVerifications || 0}
                icon={<Clock className="h-5 w-5" />}
                trend={stats?.pendingVerifications && stats.pendingVerifications > 10 ? "High" : "Normal"}
                trendUp={false}
                color="bg-orange-500"
              />
              <StatsCard
                title="Verified Items"
                value={stats?.verifiedItems || 0}
                icon={<BadgeCheck className="h-5 w-5" />}
                trend={`${stats?.verifiedItems && stats?.totalItems ? Math.round((stats.verifiedItems / stats.totalItems) * 100) : 0}%`}
                trendUp={true}
                color="bg-purple-500"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Newly registered users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {usersLoading && activeTab === 'overview' ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                          <div className="space-y-1 flex-1">
                            <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                            <div className="h-2 bg-muted rounded w-16 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    users.slice(0, 5).map(user => (
                      <UserRow key={user.id} user={user} onAction={handleUserAction} />
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Items</CardTitle>
                  <CardDescription>Recently listed items</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itemsLoading && activeTab === 'overview' ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="h-12 w-12 bg-muted rounded animate-pulse"></div>
                          <div className="space-y-1 flex-1">
                            <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
                            <div className="h-2 bg-muted rounded w-20 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    items.slice(0, 5).map(item => (
                      <ItemRow key={item.id} item={item} onAction={handleItemAction} />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {usersLoading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="grid gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                          <div className="h-3 bg-muted rounded w-48 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Users ({filteredUsers.length})
              </h2>
              <div className="flex items-center gap-3">
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm bg-background"
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredUsers.map(user => (
                <UserCard key={user.id} user={user} onAction={handleUserAction} />
              ))}
              </div>
              </>
            )}
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="space-y-6">
            {itemsLoading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="h-32 bg-muted rounded mb-3 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Items ({filteredItems.length})
              </h2>
              <div className="flex items-center gap-3">
                <select
                  value={itemFilter}
                  onChange={(e) => setItemFilter(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm bg-background"
                >
                  <option value="all">All Items</option>
                  <option value="pending">Pending Review</option>
                  <option value="verified">Verified</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} onAction={handleItemAction} />
              ))}
              </div>
              </>
            )}
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-6">
            {verificationsLoading ? (
              <div className="space-y-4">
                <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4"></div>
                <div className="grid gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-muted rounded animate-pulse"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-28 animate-pulse"></div>
                          <div className="h-3 bg-muted rounded w-40 animate-pulse"></div>
                        </div>
                        <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    User Verifications ({verifications.length})
                  </h2>
                  <Button variant="outline">
                    View All
                  </Button>
                </div>
                <div className="grid gap-4">
                  {verifications.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">No pending verifications</p>
                      </CardContent>
                    </Card>
                  ) : (
                    verifications.map(verification => (
                      <VerificationCard
                        key={verification.id}
                        verification={verification}
                        onAction={handleVerificationAction}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                  <CardDescription>User and item growth over time</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Analytics charts would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Most popular item categories</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Category charts would go here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Component definitions
function StatsCard({ title, value, icon, trend, trendUp, color }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend} from last month
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color} text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserRow({ user, onAction: _onAction }: { user: any; onAction: (id: string, action: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex items-center gap-2">
        {user.isVerified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
        <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
    </div>
  );
}

function ItemRow({ item, onAction: _onAction }: { item: any; onAction: (id: string, action: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <img
        src={item.images[0]}
        alt={item.title}
        className="w-8 h-8 rounded object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.title}</p>
        <p className="text-xs text-muted-foreground">₹{item.price}</p>
      </div>
      <Badge
        variant={
          item.status === 'pending' ? 'secondary' :
          item.status === 'approved' ? 'default' : 'destructive'
        }
        className="text-xs"
      >
        {item.status}
      </Badge>
    </div>
  );
}

function UserCard({ user, onAction }: { user: any; onAction: (id: string, action: string) => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{user.name}</h3>
                {user.isVerified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.branch} • Year {user.year} • {user.itemsCount} items
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={user.isActive ? 'default' : 'secondary'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAction(user.id, 'view')}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction(user.id, user.isActive ? 'suspend' : 'activate')}>
                  {user.isActive ? (
                    <>
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend User
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate User
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ItemCard({ item, onAction }: { item: any; onAction: (id: string, action: string) => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                ₹{item.price} • by {item.seller.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.category} • {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                item.status === 'pending' ? 'secondary' :
                item.status === 'approved' ? 'default' : 'destructive'
              }
            >
              {item.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAction(item.id, 'view')}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {item.status === 'pending' && (
                  <>
                    <DropdownMenuItem onClick={() => onAction(item.id, 'approve')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction(item.id, 'reject')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VerificationCard({ verification, onAction }: {
  verification: any;
  onAction: (id: string, action: string) => void
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={verification.user.avatar} alt={verification.user.name} />
              <AvatarFallback>{verification.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{verification.user.name}</h3>
              <p className="text-sm text-muted-foreground">{verification.user.email}</p>
              <p className="text-xs text-muted-foreground">
                Submitted {formatDistanceToNow(new Date(verification.submittedAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Verification Document</DialogTitle>
                  <DialogDescription>
                    Review {verification.user.name}'s verification document
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={verification.imageUrl}
                    alt="Verification document"
                    className="w-full rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Badge
              variant={
                verification.status === 'PENDING' ? 'secondary' :
                verification.status === 'VERIFIED' ? 'default' : 'destructive'
              }
            >
              {verification.status}
            </Badge>
            {verification.status === 'PENDING' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onAction(verification.id, 'approve')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onAction(verification.id, 'reject')}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}