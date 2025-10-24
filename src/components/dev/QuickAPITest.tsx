import React from 'react';
import { 
  useHealth, 
  useProfile, 
  useCategories, 
  useMyItems,
  useWishlist,
  useMyFeedback,
  useConnectivityStatus
} from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const QuickAPITest: React.FC = () => {
  // Health and connectivity
  const { data: health, isLoading: healthLoading, error: healthError } = useHealth();
  const { data: connectivity, isLoading: connectivityLoading } = useConnectivityStatus();

  // User data
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  
  // App data
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: myItems, isLoading: itemsLoading, error: itemsError } = useMyItems();
  const { data: wishlist, isLoading: wishlistLoading, error: wishlistError } = useWishlist();
  const { data: feedback, isLoading: feedbackLoading, error: feedbackError } = useMyFeedback();

  const getStatusIcon = (isLoading: boolean, error: any, data: any) => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (error) return <XCircle className="h-4 w-4 text-red-500" />;
    if (data) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = (isLoading: boolean, error: any, data: any) => {
    if (isLoading) return 'Loading...';
    if (error) return `Error: ${error.message}`;
    if (data) return 'Success';
    return 'No data';
  };

  const getStatusVariant = (isLoading: boolean, error: any, data: any): "default" | "secondary" | "destructive" | "outline" => {
    if (isLoading) return 'secondary';
    if (error) return 'destructive';
    if (data) return 'default';
    return 'outline';
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">API Integration Test</h1>
        <p className="text-gray-600 mb-4">
          Quick verification of all React Query hooks and API endpoints
        </p>
        <Button onClick={refreshPage} variant="outline" className="mb-6">
          Refresh Test
        </Button>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            System Health
            {getStatusIcon(healthLoading || connectivityLoading, healthError, health)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🏥</div>
              <p className="font-medium">API Health</p>
              <Badge variant={getStatusVariant(healthLoading, healthError, health)}>
                {getStatusText(healthLoading, healthError, health)}
              </Badge>
              {health && (
                <p className="text-xs text-gray-500 mt-1">
                  Status: {health.status}
                </p>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">
                {connectivity?.isOnline ? '🌐' : '📵'}
              </div>
              <p className="font-medium">Network</p>
              <Badge variant={connectivity?.isOnline ? 'default' : 'destructive'}>
                {connectivity?.isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">
                {connectivity?.isApiReachable ? '✅' : '❌'}
              </div>
              <p className="font-medium">API Connectivity</p>
              <Badge variant={connectivity?.isApiReachable ? 'default' : 'destructive'}>
                {connectivity?.isApiReachable ? 'Connected' : 'Unreachable'}
              </Badge>
              {connectivity?.latency && (
                <p className="text-xs text-gray-500 mt-1">
                  Latency: {connectivity.latency}ms
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Profile */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Profile
              {getStatusIcon(profileLoading, profileError, profile)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(profileLoading, profileError, profile)}>
              {getStatusText(profileLoading, profileError, profile)}
            </Badge>
            {profile && (
              <div className="mt-3 space-y-1 text-sm">
                <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
                <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
                <p><strong>Verified:</strong> {profile.isVerified ? 'Yes' : 'No'}</p>
              </div>
            )}
            {profileError && (
              <p className="mt-2 text-xs text-red-600">
                {profileError.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Categories
              {getStatusIcon(categoriesLoading, categoriesError, categories)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(categoriesLoading, categoriesError, categories)}>
              {getStatusText(categoriesLoading, categoriesError, categories)}
            </Badge>
            {categories && (
              <div className="mt-3">
                <p className="text-sm"><strong>Count:</strong> {categories.categories.length}</p>
                {categories.categories.slice(0, 3).map((cat) => (
                  <Badge key={cat.id} variant="outline" className="mr-1 mt-1 text-xs">
                    {cat.name}
                  </Badge>
                ))}
                {categories.categories.length > 3 && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    +{categories.categories.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              My Items
              {getStatusIcon(itemsLoading, itemsError, myItems)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(itemsLoading, itemsError, myItems)}>
              {getStatusText(itemsLoading, itemsError, myItems)}
            </Badge>
            {myItems && (
              <div className="mt-3">
                <p className="text-sm"><strong>Count:</strong> {myItems.items.length}</p>
                <p className="text-sm"><strong>Sold:</strong> {myItems.items.filter(item => item.isSold).length}</p>
                <p className="text-sm"><strong>Verified:</strong> {myItems.items.filter(item => item.isVerified).length}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wishlist */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Wishlist
              {getStatusIcon(wishlistLoading, wishlistError, wishlist)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(wishlistLoading, wishlistError, wishlist)}>
              {getStatusText(wishlistLoading, wishlistError, wishlist)}
            </Badge>
            {wishlist && (
              <div className="mt-3">
                <p className="text-sm"><strong>Items:</strong> {wishlist.items?.length || 0}</p>
                <p className="text-sm"><strong>Entries:</strong> {wishlist.wishlist?.length || 0}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              My Feedback
              {getStatusIcon(feedbackLoading, feedbackError, feedback !== undefined)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(feedbackLoading, feedbackError, feedback !== undefined)}>
              {feedbackLoading ? 'Loading...' : feedbackError ? 'Error' : feedback ? 'Has Feedback' : 'No Feedback'}
            </Badge>
            {feedback && (
              <div className="mt-3">
                <p className="text-sm"><strong>Rating:</strong> {feedback.rating}/5</p>
                <p className="text-sm"><strong>Content:</strong> {feedback.content?.substring(0, 50)}...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Overall Status
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Health:</span>
                <Badge variant={health ? 'default' : 'destructive'}>
                  {health ? 'OK' : 'Error'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Profile:</span>
                <Badge variant={profile ? 'default' : 'destructive'}>
                  {profile ? 'Loaded' : 'Error'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Categories:</span>
                <Badge variant={categories ? 'default' : 'destructive'}>
                  {categories ? 'Loaded' : 'Error'}
                </Badge>
              </div>
              <hr className="my-2" />
              <p className="text-xs text-center text-gray-500">
                Integration: {health && categories ? '✅ Working' : '❌ Issues'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Details */}
      {(healthError || profileError || categoriesError || itemsError || wishlistError || feedbackError) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {healthError && <p><strong>Health:</strong> {healthError.message}</p>}
              {profileError && <p><strong>Profile:</strong> {profileError.message}</p>}
              {categoriesError && <p><strong>Categories:</strong> {categoriesError.message}</p>}
              {itemsError && <p><strong>Items:</strong> {itemsError.message}</p>}
              {wishlistError && <p><strong>Wishlist:</strong> {wishlistError.message}</p>}
              {feedbackError && <p><strong>Feedback:</strong> {feedbackError.message}</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickAPITest;