import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  useAdminVerifications,
  useUpdateVerification,
} from '@/hooks/api';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import type { Verification } from '@/types';

// Helper Components (moved from AdminDashboard.tsx)
function VerificationCard({ verification, onAction }: {
  verification: Verification;
  onAction: (id: string, action: string) => void
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Link to={`/profile/${verification.user?.id}`} className="flex items-center gap-3 group" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={verification.user?.avatar || ''} alt={verification.user?.name} />
                <AvatarFallback>{verification.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">{verification.user?.name || ''}</h3>
                <p className="text-sm text-muted-foreground">{verification.user?.email || ''}</p>
                <p className="text-xs text-muted-foreground">
                  Submitted {formatDistanceToNow(new Date(verification.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </Link>
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
                    Review {verification.user?.name}'s verification document
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={verification.image?.url || ''}
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
                  className="bg-emerald-600 hover:bg-emerald-700"
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

export function AdminVerificationsPage() {
  const { data: verificationsData, isLoading: verificationsLoading } = useAdminVerifications({ status: 'PENDING', limit: 20 });
  const updateVerificationMutation = useUpdateVerification();

  const handleVerificationAction = async (verificationId: string, action: string) => {
    if (updateVerificationMutation.isPending) {
      return;
    }

    try {
      await updateVerificationMutation.mutateAsync({ id: verificationId, data: { status: action === 'approve' ? 'VERIFIED' : 'REJECTED' } });
      toast.success(`Verification ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} verification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const verifications = verificationsData?.items || [];

  if (verificationsLoading) {
    return <AdminVerificationsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle>User Verifications</CardTitle>
        <CardDescription>
          Review and approve or reject pending user verification requests.
        </CardDescription>
      </CardHeader>
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
    </div>
  );
}

function AdminVerificationsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
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