import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AuthDebug() {
  const { user, loading } = useAuth();
  
  const authData = {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    userRole: localStorage.getItem('userRole'),
    adminData: localStorage.getItem('adminData'),
  };

  const clearAll = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminData');
    window.location.reload();
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 max-h-96 overflow-auto z-50 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm">Auth Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>User:</strong> {user ? user.name : 'None'}
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || 'None'}
        </div>
        <div>
          <strong>User Email:</strong> {user?.email || 'None'}
        </div>
        <div>
          <strong>Access Token:</strong> {authData.accessToken ? 'Present' : 'None'}
        </div>
        <div>
          <strong>Refresh Token:</strong> {authData.refreshToken ? 'Present' : 'None'}
        </div>
        <div>
          <strong>User Role:</strong> {authData.userRole || 'None'}
        </div>
        <div>
          <strong>Admin Data:</strong> {authData.adminData ? 'Present' : 'None'}
        </div>
        
        <div className="pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAll}
            className="w-full text-xs"
          >
            Clear All Auth Data
          </Button>
        </div>
        
        <div className="pt-2 text-[10px] text-gray-500">
          <strong>Raw localStorage:</strong>
          <pre className="mt-1 p-1 bg-gray-50 rounded text-[9px] overflow-x-auto">
            {JSON.stringify(authData, null, 1)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}