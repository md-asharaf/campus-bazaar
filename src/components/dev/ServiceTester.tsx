import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  healthService, 
  categoryService, 
  itemService, 
  searchService
} from '@/services';

type TestResult = {
  service: string;
  method: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
};

export const ServiceTester = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testHealth = async () => {
    try {
      const response = await healthService.checkHealth();
      addResult({
        service: 'Health',
        method: 'checkHealth',
        success: true,
        message: 'Health check successful',
        data: response
      });
    } catch (error: any) {
      addResult({
        service: 'Health',
        method: 'checkHealth',
        success: false,
        message: 'Health check failed',
        error: error.message
      });
    }
  };

  const testCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      addResult({
        service: 'Category',
        method: 'getAllCategories',
        success: true,
        message: 'Categories fetched successfully',
        data: response
      });
    } catch (error: any) {
      addResult({
        service: 'Category',
        method: 'getAllCategories',
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  };

  const testItemSearch = async () => {
    try {
      const response = await itemService.searchItems({ 
        q: 'test', 
        page: 1, 
        limit: 5 
      });
      addResult({
        service: 'Item',
        method: 'searchItems',
        success: true,
        message: 'Item search successful',
        data: response
      });
    } catch (error: any) {
      addResult({
        service: 'Item',
        method: 'searchItems',
        success: false,
        message: 'Item search failed',
        error: error.message
      });
    }
  };

  const testSearch = async () => {
    try {
      const response = await searchService.getSuggestions({ 
        q: 'test', 
        limit: 5 
      });
      addResult({
        service: 'Search',
        method: 'getSuggestions',
        success: true,
        message: 'Search suggestions successful',
        data: response
      });
    } catch (error: any) {
      addResult({
        service: 'Search',
        method: 'getSuggestions',
        success: false,
        message: 'Search suggestions failed',
        error: error.message
      });
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    clearResults();
    
    // Run tests sequentially with small delays
    await testHealth();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testCategories();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testItemSearch();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testSearch();
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Service Tester</h1>
        <p className="text-gray-600 mb-4">
          Test all frontend services to validate backend connectivity
        </p>
        
        <div className="flex gap-2 justify-center flex-wrap">
          <Button onClick={testHealth} disabled={loading}>
            Test Health
          </Button>
          <Button onClick={testCategories} disabled={loading}>
            Test Categories
          </Button>
          <Button onClick={testItemSearch} disabled={loading}>
            Test Item Search
          </Button>
          <Button onClick={testSearch} disabled={loading}>
            Test Search
          </Button>
          <Button onClick={runAllTests} disabled={loading} variant="default">
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button onClick={clearResults} variant="outline">
            Clear Results
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {results.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No test results yet. Click a test button to get started.</p>
            </CardContent>
          </Card>
        ) : (
          results.map((result, index) => (
            <Card key={index} className={result.success ? 'border-green-200' : 'border-red-200'}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {result.service} Service
                  </CardTitle>
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
                <CardDescription>
                  Method: <code className="bg-gray-100 px-1 rounded">{result.method}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{result.message}</p>
                  
                  {result.error && (
                    <div className="bg-red-50 p-2 rounded">
                      <p className="text-red-700 text-sm">
                        <strong>Error:</strong> {result.error}
                      </p>
                    </div>
                  )}
                  
                  {result.data && (
                    <details className="bg-gray-50 p-2 rounded">
                      <summary className="cursor-pointer text-sm font-medium mb-2">
                        View Response Data
                      </summary>
                      <pre className="text-xs overflow-auto bg-white p-2 rounded border max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>
            All services have been implemented according to the backend routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Auth Services</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• User Registration</li>
                <li>• Google Auth</li>
                <li>• Admin Login</li>
                <li>• Token Refresh</li>
                <li>• Logout</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">User Services</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Profile Management</li>
                <li>• Item CRUD</li>
                <li>• Wishlist</li>
                <li>• Feedback</li>
                <li>• Chat/Messaging</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Public Services</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Category Listing</li>
                <li>• Item Search</li>
                <li>• Search Suggestions</li>
                <li>• Item Details</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Admin Services</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• User Management</li>
                <li>• Item Verification</li>
                <li>• Category Management</li>
                <li>• Feedback Review</li>
                <li>• Verification System</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Utility Services</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Health Checks</li>
                <li>• Socket Connection</li>
                <li>• File Uploads</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};