import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  MoreVertical,
  Ban,
  CheckCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import {
  useAdminUsers,
  useUpdateUserAsAdmin,
  useToggleUserStatus,
  useDeleteUserAsAdmin,
} from '@/hooks/api';
import { toast } from 'sonner';

// Helper Components (moved from AdminDashboard.tsx)
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
                {user.isVerified && <Badge variant="secondary" className="text-blue-500 bg-blue-100">Verified</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.branch} • Year {user.year} • {user.itemsCount || 0} items
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
                <DropdownMenuItem onClick={() => onAction(user.id, user.isActive ? 'deactivate' : 'activate')}>
                  {user.isActive ? (
                    <>
                      <Ban className="h-4 w-4 mr-2" />
                      Deactivate User
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate User
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction(user.id, 'delete')} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminUsersPage() {
  const [userFilter, setUserFilter] = useState('all');
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ limit: 20 });

  const updateUserMutation = useUpdateUserAsAdmin();
  const toggleUserStatusMutation = useToggleUserStatus();
  const deleteUserMutation = useDeleteUserAsAdmin();

  const handleUserAction = async (userId: string, action: string) => {
    if (updateUserMutation.isPending || toggleUserStatusMutation.isPending || deleteUserMutation.isPending) {
      return;
    }

    try {
      switch (action) {
        case 'activate':
        case 'deactivate':
          await toggleUserStatusMutation.mutateAsync(userId);
          toast.success(`User ${action}d successfully`);
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await deleteUserMutation.mutateAsync(userId);
            toast.success('User deleted successfully');
          }
          break;
        default:
          toast.error('Unknown action');
      }
    } catch (error) {
      toast.error(`Failed to ${action} user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const users = usersData?.items || [];
  const filteredUsers = users.filter(user => {
    if (userFilter === 'verified') return user.isVerified;
    if (userFilter === 'unverified') return !user.isVerified;
    if (userFilter === 'inactive') return !user.isActive;
    return true;
  });

  if (usersLoading) {
    return <AdminUsersPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">User Management</h1>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users ({filteredUsers.length})</h2>
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
    </div>
  );
}

function AdminUsersPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}