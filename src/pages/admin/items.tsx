import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import {
  useAdminItems,
  useUpdateItemAsAdmin,
  useVerifyItem,
  useRejectItem,
  useDeleteItemAsAdmin,
} from '@/hooks/api';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// Helper Components (moved from AdminDashboard.tsx)
function ItemCard({ item, onAction }: { item: any; onAction: (id: string, action: string) => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={item?.images?.[0]?.url || '/placeholder-item.jpg'}
              alt={"N/A"}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                ₹{item.price} • by {item.seller?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.category?.name} • {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                item.isSold ? 'destructive' :
                item.isVerified ? 'default' : 'secondary'
              }
            >
              {item.isSold ? 'Sold' : (item.isVerified ? 'Verified' : 'Pending')}
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
                {!item.isVerified && (
                  <>
                    <DropdownMenuItem onClick={() => onAction(item.id, 'verify')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction(item.id, 'reject')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
                {!item.isSold ? (
                  <DropdownMenuItem onClick={() => onAction(item.id, 'mark-sold')}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Mark as Sold
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onAction(item.id, 'mark-available')}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Mark as Available
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onAction(item.id, 'delete')} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminItemsPage() {
  const [itemFilter, setItemFilter] = useState('all');
  const { data: itemsData, isLoading: itemsLoading } = useAdminItems({ limit: 20 });

  const updateItemMutation = useUpdateItemAsAdmin();
  const verifyItemMutation = useVerifyItem();
  const rejectItemMutation = useRejectItem();
  const deleteItemMutation = useDeleteItemAsAdmin();

  const handleItemAction = async (itemId: string, action: string) => {
    if (updateItemMutation.isPending || verifyItemMutation.isPending ||
      rejectItemMutation.isPending || deleteItemMutation.isPending) {
      return;
    }

    try {
      switch (action) {
        case 'verify': await verifyItemMutation.mutateAsync(itemId); toast.success('Item verified successfully'); break;
        case 'reject': await rejectItemMutation.mutateAsync(itemId); toast.success('Item rejected successfully'); break;
        case 'mark-sold': await updateItemMutation.mutateAsync({ itemId, data: { isSold: true } }); toast.success('Item marked as sold'); break;
        case 'mark-available': await updateItemMutation.mutateAsync({ itemId, data: { isSold: false } }); toast.success('Item marked as available'); break;
        case 'delete':
          if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            await deleteItemMutation.mutateAsync(itemId);
            toast.success('Item deleted successfully');
          }
          break;
        default: toast.error('Unknown action');
      }
    } catch (error) {
      toast.error(`Failed to ${action} item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const items = itemsData?.items || [];
  const filteredItems = items.filter(item => {
    if (itemFilter === 'verified') return item.isVerified;
    if (itemFilter === 'pending') return !item.isVerified;
    if (itemFilter === 'sold') return item.isSold;
    return true;
  });

  if (itemsLoading) {
    return <AdminItemsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Item Management</h1>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Items ({filteredItems.length})</h2>
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
    </div>
  );
}

function AdminItemsPageSkeleton() {
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
                <Skeleton className="h-12 w-12 rounded" />
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