import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  useProfile,
  useSearchItems,
  useCategories,
  useMyChats,
  useWishlist,
  useMyFeedback,
  useCreateItem,
  useAddToWishlist,
  useCreateFeedback,
  useHealth,
  useConnectivityStatus,
} from '@/hooks';

export const APIHooksExample = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  // Profile hooks
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  
  // Search hooks
  const { data: searchResults, isLoading: searchLoading, error: searchError } = useSearchItems({
    q: searchQuery,
    limit: 5
  });
  
  // Categories hooks
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Chat hooks
  const { data: chats, isLoading: chatsLoading, error: chatsError } = useMyChats();
  
  // Wishlist hooks
  const { data: wishlist, isLoading: wishlistLoading, error: wishlistError } = useWishlist();
  
  // Feedback hooks
  const { data: feedback, isLoading: feedbackLoading, error: feedbackError } = useMyFeedback();
  
  // Health hooks
  const { data: health, isLoading: healthLoading, error: healthError } = useHealth();
  const connectivityStatus = useConnectivityStatus();
  
  // Mutation hooks
  const createItemMutation = useCreateItem();
  const addToWishlistMutation = useAddToWishlist();
  const createFeedbackMutation = useCreateFeedback();

  const handleCreateItem = () => {
    if (!newItemTitle) return;
    
    // This would need a proper image file in real usage
    const mockFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' });
    
    createItemMutation.mutate({
      title: newItemTitle,
      price: 100,
      image: mockFile,
    });
    
    setNewItemTitle('');
  };

  const handleAddToWishlist = (itemId: string) => {
    addToWishlistMutation.mutate({ itemId });
  };

  const handleCreateFeedback = () => {
    createFeedbackMutation.mutate({
      content: feedbackContent,
      rating: feedbackRating,
    });
    
    setFeedbackContent('');
    setFeedbackRating(5);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">API Hooks Integration Examples</h1>
        <p className="text-gray-600">
          Real-time examples of React Query hooks working with backend APIs
        </p>
        
        {/* Connectivity Status */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <Badge variant={connectivityStatus.data?.isApiReachable ? 'default' : 'destructive'}>
            {connectivityStatus.data?.isApiReachable ? 'Connected' : 'Disconnected'}
          </Badge>
          <Badge variant="outline">
            Network: {connectivityStatus.data?.isOnline ? 'Online' : 'Offline'}
          </Badge>
          <Badge variant="outline">
            API: {connectivityStatus.data?.isApiReachable ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Data</CardTitle>
            <CardDescription>useProfile hook example</CardDescription>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
              </div>
            ) : profileError ? (
              <p className="text-red-500 text-sm">Error: {profileError.message}</p>
            ) : profile ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
                <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
                <p className="flex items-center">
                  <strong>Verified:</strong>
                  <Badge className="ml-2" variant={profile.isVerified ? 'default' : 'secondary'}>
                    {profile.isVerified ? 'Yes' : 'No'}
                  </Badge>
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No profile data available</p>
            )}
          </CardContent>
        </Card>

        {/* Search Items Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Item Search</CardTitle>
            <CardDescription>useSearchItems hook example</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {searchLoading && searchQuery ? (
              <div className="text-sm text-gray-500">Searching...</div>
            ) : searchError ? (
              <p className="text-red-500 text-sm">Error: {searchError.message}</p>
            ) : searchResults && Array.isArray(searchResults) && searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Found {searchResults.length} items:
                </p>
                {searchResults.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="text-sm p-2 bg-gray-50 rounded">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-gray-600">${item.price}</div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-1"
                      onClick={() => handleAddToWishlist(item.id)}
                      disabled={addToWishlistMutation.isPending}
                    >
                      Add to Wishlist
                    </Button>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <p className="text-sm text-gray-500">No items found</p>
            ) : (
              <p className="text-sm text-gray-500">Enter search query</p>
            )}
          </CardContent>
        </Card>

        {/* Categories Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription>useCategories hook example</CardDescription>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : categoriesError ? (
              <p className="text-red-500 text-sm">Error: {categoriesError.message}</p>
            ) : categories && Array.isArray(categories) && categories.length > 0 ? (
              <div className="space-y-2">
                {categories.slice(0, 5).map((category: any) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.items?.length || 0} items
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No categories available</p>
            )}
          </CardContent>
        </Card>

        {/* Chats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Chats</CardTitle>
            <CardDescription>useMyChats hook example</CardDescription>
          </CardHeader>
          <CardContent>
            {chatsLoading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : chatsError ? (
              <p className="text-red-500 text-sm">Error: {chatsError.message}</p>
            ) : chats && Array.isArray(chats) && chats.length > 0 ? (
              <div className="space-y-2">
                {chats.slice(0, 3).map((chat: any) => (
                  <div key={chat.id} className="text-sm p-2 bg-gray-50 rounded">
                    <div className="font-medium">{chat.otherUser?.name || 'Unknown User'}</div>
                    <div className="text-gray-600 truncate">
                      {chat.latestMessage?.content || 'No messages yet'}
                    </div>
                    {chat.unreadCount > 0 && (
                      <Badge className="mt-1" variant="destructive">
                        {chat.unreadCount} unread
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No chats available</p>
            )}
          </CardContent>
        </Card>

        {/* Wishlist Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wishlist</CardTitle>
            <CardDescription>useWishlist hook example</CardDescription>
          </CardHeader>
          <CardContent>
            {wishlistLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : wishlistError ? (
              <p className="text-red-500 text-sm">Error: {wishlistError.message}</p>
            ) : wishlist && Array.isArray(wishlist) && wishlist.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {wishlist.length} items in wishlist
                </p>
                {wishlist.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="text-sm p-2 bg-gray-50 rounded">
                    <div className="font-medium">{item.item?.title || 'Item'}</div>
                    <div className="text-gray-600">${item.item?.price || 0}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Wishlist is empty</p>
            )}
          </CardContent>
        </Card>

        {/* Create Item Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create Item</CardTitle>
            <CardDescription>useCreateItem mutation example</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Item title..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
            />
            <Button 
              onClick={handleCreateItem}
              disabled={!newItemTitle || createItemMutation.isPending}
              className="w-full"
            >
              {createItemMutation.isPending ? 'Creating...' : 'Create Item'}
            </Button>
            {createItemMutation.isError && (
              <p className="text-red-500 text-sm">
                Error: {createItemMutation.error?.message}
              </p>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Feedback Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Feedback Management</CardTitle>
          <CardDescription>useMyFeedback and useCreateFeedback hooks example</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Feedback */}
            <div>
              <h4 className="font-medium mb-3">Current Feedback</h4>
              {feedbackLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : feedbackError ? (
                <p className="text-red-500 text-sm">Error: {feedbackError.message}</p>
              ) : feedback ? (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span>Rating:</span>
                    <Badge>{feedback.rating}/5</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{feedback.content}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No feedback submitted yet</p>
              )}
            </div>

            {/* Create Feedback */}
            <div>
              <h4 className="font-medium mb-3">Submit New Feedback</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Rating: {feedbackRating}/5</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <Input
                  placeholder="Feedback content..."
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                />
                <Button 
                  onClick={handleCreateFeedback}
                  disabled={!feedbackContent || createFeedbackMutation.isPending}
                  className="w-full"
                >
                  {createFeedbackMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>useHealth and connectivity hooks example</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">
                {healthLoading ? '⏳' : healthError ? '❌' : health ? '✅' : '❓'}
              </div>
              <p className="font-medium">API Health</p>
              <p className="text-sm text-gray-600">
                {healthLoading ? 'Checking...' : 
                 healthError ? 'Error checking health' :
                 health ? 'API is healthy' : 'Unknown status'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">
                {connectivityStatus.data?.isOnline ? '🌐' : '📵'}
              </div>
              <p className="font-medium">Network</p>
              <p className="text-sm text-gray-600">
                {connectivityStatus.data?.isOnline ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">
                {connectivityStatus.data?.isApiReachable ? '🟢' : '🔴'}
              </div>
              <p className="font-medium">Overall Status</p>
              <p className="text-sm text-gray-600">
                {connectivityStatus.status}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use These Hooks</CardTitle>
          <CardDescription>Code examples for integrating API hooks in your components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Basic Query Hook Usage:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { useSearchItems } from '@/hooks';

const { data, isLoading, error } = useSearchItems({
  q: 'laptop',
  limit: 10
});

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
return <div>{data?.length || 0} items found</div>;`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Mutation Hook Usage:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { useCreateItem } from '@/hooks';

const mutation = useCreateItem();

const handleSubmit = () => {
  mutation.mutate({
    title: 'New Item',
    price: 100,
    image: fileInput
  });
};`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};