import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Home,
  Users,
  Package,
  BadgeCheck,
  BarChart3,
  Menu,
  LogOut,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminLayout() {
  const { admin, loading, logout } = useAdminAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !admin && location.pathname.startsWith('/admin')) {
      navigate('/login')
      return;
    }
  }, [admin, loading, location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login?from=/admin" replace />;
  }

  const navItems = [
    { name: 'Overview', icon: Home, path: '/admin' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Items', icon: Package, path: '/admin/items' },
    { name: 'Verifications', icon: BadgeCheck, path: '/admin/verifications' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-primary">CampusBazaar</h2>
        <p className="text-sm text-muted-foreground">Admin Panel</p>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${location.pathname === item.path
                  ? 'bg-muted text-primary'
                  : 'text-muted-foreground'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarContent />
      </div>

      {/* Mobile Header & Sidebar */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-[280px] sm:w-[320px] p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold text-primary">Admin Panel</h1>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}