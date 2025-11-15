import { useAuth } from "@/hooks/use-auth";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import { socketService } from "@/services/socket.service";
import { ChatProvider } from "@/contexts/chat-context";

export const PrivateLayout = () => {
  const navigate = useNavigate();
  const { loading, user } = useAuth();
  const connectionAttempted = useRef(false);

  // Enhanced socket initialization with better error handling
  useEffect(() => {
    if (user && !loading && !connectionAttempted.current) {
      connectionAttempted.current = true;

      // Small delay to ensure authentication is fully set up
      const connectTimeout = setTimeout(() => {
        console.log('Attempting socket connection for authenticated user:', user.id);

        // Connect socket when user is authenticated
        socketService.connect()
          .then(() => {
            console.log('Socket connected successfully');
          })
          .catch(error => {
            console.error('Socket connection failed:', error);
          });
      }, 500); // 500ms delay to allow authentication to stabilize

      return () => {
        clearTimeout(connectTimeout);
      };
    }

    // Reset connection attempt flag when user logs out
    if (!user && !loading) {
      connectionAttempted.current = false;
      socketService.disconnect();
    }

    // Cleanup on unmount
    return () => {
      if (!user) {
        socketService.disconnect();
      }
    };
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div className="flex flex-col items-center justify-center h-screen w-screen space-y-6">
      You must be logged in to access this page.
      <br />
      <div className="flex items-center justify-center gap-4">
        <Button onClick={() => {
          navigate('/student-login');
        }}>
          Login
        </Button>
        <Link to='/'>
          <Button >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  }

  return (
    <ChatProvider>
      <div className="h-screen w-screen bg-background text-foreground font-sans overflow-hidden">
        <Outlet />
      </div>
    </ChatProvider>
  );
};