import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { categoryService, itemService, healthService } from '@/services';

export const SimpleAPITest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Basic health check
  const { 
    data: healthData, 
    isLoading: healthLoading, 
    error: healthError,
    refetch: refetchHealth 
  } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await healthService.checkHealth();
      return response;
    },
    retry: 1,
  });

  // Categories query
  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Search items query (only when searchTerm is not empty)
  const { 
    data: searchData, 
    isLoading: searchLoading, 
    error: searchError,
    refetch: refetchSearch 
  } = useQuery({
    queryKey: ['items', 'search', searchTerm],
    queryFn: async () => {
      const response = await itemService.searchItems({ q: searchTerm, limit: 5 });
      return response;
    },
    enabled: searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Test mutation (health ping)
  const healthPingMutation = useMutation({
    mutationFn: async () => {
      const response = await healthService.ping();
      return response;
    },
  });

  const handlePing = () => {
    healthPingMutation.mutate();
  };

  const handleRefreshAll = () => {
    refetchHealth();
    if (searchTerm.length >= 2) {
      refetchSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Simple API Test</h1>
        <p className="text-gray-600">
          Basic test of API connectivity and data fetching
        </p>
        
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button onClick={handleRefreshAll} variant="outline">
            Refresh All
          </Button>
          <Button onClick={handlePing} disabled={healthPingMutation.isPending}>
            {healthPingMutation.isPending ? 'Pinging...' : 'Ping API'}
          </Button>
        </div>

        {/* Ping Results */}
        {healthPingMutation.data && (
          <div className="mt-2 p-2 bg-green-50 rounded">
            <p className="text-sm text-green-700">
              Ping successful: {healthPingMutation.data.message}
            </p>
          </div>
        )}
        
        {healthPingMutation.error && (
          <div className="mt-2 p-2 bg-red-50 rounded">
            <p className="text-sm text-red-700">
              Ping failed: {healthPingMutation.error.message}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">API Health</CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : healthError ? (
              <div className="text-red-600">
                <p className="font-medium">Error</p>
                <p className="text-sm">{healthError.message}</p>
              </div>
            ) : healthData ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={healthData.success ? 'default' : 'destructive'}>
                    {healthData.success ? 'Healthy' : 'Unhealthy'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{healthData.message}</p>
                {healthData.timestamp && (
                  <p className="text-xs text-gray-500">
                    Last check: {new Date(healthData.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No health data</p>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : categoriesError ? (
              <div className="text-red-600">
                <p className="font-medium">Error</p>
                <p className="text-sm">{categoriesError.message}</p>
              </div>
            ) : categoriesData?.success && categoriesData.data ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Found {categoriesData.data.length} categories
                </p>
                {categoriesData.data.slice(0, 5).map((category: any) => (
                  <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      ID: {category.id.slice(0, 8)}...
                    </Badge>
                  </div>
                ))}
                {categoriesData.data.length > 5 && (
                  <p className="text-xs text-gray-500">
                    ...and {categoriesData.data.length - 5} more
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No categories available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Item Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Search items (minimum 2 characters)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm.length >= 2 && (
            <div>
              {searchLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : searchError ? (
                <div className="text-red-600">
                  <p className="font-medium">Search Error</p>
                  <p className="text-sm">{searchError.message}</p>
                </div>
              ) : searchData?.success && searchData.data ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Found {searchData.data.length} items for "{searchTerm}"
                  </p>
                  {searchData.data.length > 0 ? (
                    searchData.data.map((item: any) => (
                      <div key={item.id} className="p-3 bg-gray-50 rounded space-y-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-600">${item.price}</div>
                        <div className="flex gap-2">
                          <Badge variant={item.isVerified ? 'default' : 'secondary'}>
                            {item.isVerified ? 'Verified' : 'Unverified'}
                          </Badge>
                          <Badge variant={item.isSold ? 'destructive' : 'outline'}>
                            {item.isSold ? 'Sold' : 'Available'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No items found</p>
                  )}
                </div>
              ) : searchData && !searchData.success ? (
                <p className="text-red-600 text-sm">Search failed: {searchData.message}</p>
              ) : (
                <p className="text-gray-500 text-sm">No search data</p>
              )}
            </div>
          )}

          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p className="text-gray-500 text-sm">
              Enter at least 2 characters to search
            </p>
          )}
        </CardContent>
      </Card>

      {/* API Response Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Raw API Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Health Response:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(healthData, null, 2) || 'No data'}
              </pre>
            </div>

            {categoriesData && (
              <div>
                <h4 className="font-medium mb-2">Categories Response:</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(categoriesData, null, 2)}
                </pre>
              </div>
            )}

            {searchData && searchTerm.length >= 2 && (
              <div>
                <h4 className="font-medium mb-2">Search Response:</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(searchData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">1. Health Check</p>
              <p className="text-gray-600">
                Shows if the API server is running. Click "Ping API" to test connectivity.
              </p>
            </div>
            <div>
              <p className="font-medium">2. Categories</p>
              <p className="text-gray-600">
                Automatically loads all categories from the API. Shows success/error status.
              </p>
            </div>
            <div>
              <p className="font-medium">3. Item Search</p>
              <p className="text-gray-600">
                Type at least 2 characters to search for items. Results update automatically.
              </p>
            </div>
            <div>
              <p className="font-medium">4. Raw Responses</p>
              <p className="text-gray-600">
                Shows the actual JSON responses from the API for debugging purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};