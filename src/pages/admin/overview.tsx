import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Package,
  BadgeCheck,
  Image,
} from 'lucide-react';
import {
  useAdminDashboardStats,
  useAdminUsers,
  useAdminItems,
} from '@/hooks/api';
import { Link } from 'react-router-dom';

// Helper Components (moved from AdminDashboard.tsx)
function StatsCard({ title, value, icon, trend, trendUp }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={`text-xs ${trendUp ? 'text-emerald-600' : 'text-destructive'}`}>
                {trend} from last month
              </p>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserRow({ user }: { user: any }) {
  return (
    <Link to={`/admin/users/${user.id}`} className="block">
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
    </Link>
  );
}

function ItemRow({ item }: { item: any }) {
  return (
    <Link to={`/items/${item.id}`} className="block">
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
        {item?.images?.length > 0 ? <img
          src={item?.images?.[0]?.url || '/placeholder-item.jpg'}
          alt={item.title}
          className="w-8 h-8 rounded object-cover"
        /> : <Image className="w-8 h-8 text-muted-foreground" />}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{item.title}</p>
          <p className="text-xs text-muted-foreground">₹{item.price}</p>
        </div>
      <Badge
        variant={
          item.isVerified ? 'default' : 'secondary'
        }
        className="text-xs"
      >
        {item.isVerified ? 'Verified' : 'Pending'}
      </Badge>
    </div>
    </Link>
  );
}

export function AdminOverview() {
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ limit: 5 });
  const { data: itemsData, isLoading: itemsLoading } = useAdminItems({ limit: 5 });

  const users = usersData?.items || [];
  const items = itemsData?.items || [];

  if (statsLoading || usersLoading || itemsLoading) {
    return <AdminOverviewSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Overview</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users className="h-5 w-5" />}
          trend={`${stats?.itemGrowth && stats.itemGrowth > 0 ? '+' : ''}${stats?.itemGrowth || 0}%`}
          trendUp={(stats?.itemGrowth ?? 0) > 0}
        />
        <StatsCard
          title="Active Items"
          value={stats?.totalItems || 0}
          icon={<Package className="h-5 w-5" />}
          trend={`${stats?.itemGrowth && stats.itemGrowth > 0 ? '+' : ''}${stats?.itemGrowth || 0}%`}
          trendUp={(stats?.itemGrowth ?? 0) > 0}
        />
        <StatsCard
          title="Pending Verifications"
          value={stats?.pendingVerifications || 0}
          icon={<BadgeCheck className="h-5 w-5" />}
          trend={`${stats?.pendingVerifications && stats.pendingVerifications > 10 ? "High" : "Normal"} priority`}
          trendUp={!stats?.pendingVerifications || stats.pendingVerifications <= 10}
        />
        <StatsCard
          title="Verified Items"
          value={stats?.verifiedItems || 0}
          icon={<BadgeCheck className="h-5 w-5" />}
          trend={`${stats?.verifiedItems && stats?.totalItems ? Math.round((stats.verifiedItems / stats.totalItems) * 100) : 0}%`}
          trendUp
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Users</span>
              <Link to="/admin/users" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {users.slice(0, 5).map(user => (
              <UserRow key={user.id} user={user} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Items</span>
              <Link to="/admin/items" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.slice(0, 5).map(item => (
              <ItemRow key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2 w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}