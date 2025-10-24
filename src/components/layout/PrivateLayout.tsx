import { useAuth } from "@/hooks/useAuth";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect, useState, useRef } from "react";
import { socketService, SocketConnectionState } from "@/services/socket.service";
import { ChatProvider } from "@/contexts/ChatContext";
import { ConnectionStatus } from "@/components/ui/loading-states";

export const PrivateLayout = () => {
  const navigate = useNavigate();
  const { loading, user } = useAuth();
  const [connectionState, setConnectionState] = useState<SocketConnectionState>(SocketConnectionState.DISCONNECTED);
  const [socketError, setSocketError] = useState<string | null>(null);
  const connectionAttempted = useRef(false);

  // Enhanced socket initialization with better error handling
  useEffect(() => {
    if (user && !loading && !connectionAttempted.current) {
      connectionAttempted.current = true;
      
      // Subscribe to connection state changes
      const unsubscribe = socketService.onConnectionStateChange((state) => {
        setConnectionState(state);
        if (state === SocketConnectionState.CONNECTED) {
          setSocketError(null);
        }
      });
      
      // Small delay to ensure authentication is fully set up
      const connectTimeout = setTimeout(() => {
        console.log('Attempting socket connection for authenticated user:', user.id);
        
        // Connect socket when user is authenticated
        socketService.connect()
          .then(() => {
            console.log('Socket connected successfully');
            setSocketError(null);
          })
          .catch(error => {
            console.error('Socket connection failed:', error);
            setSocketError(error.message || 'Connection failed');
          });
      }, 500); // 500ms delay to allow authentication to stabilize

      return () => {
        clearTimeout(connectTimeout);
        unsubscribe();
      };
    }

    // Reset connection attempt flag when user logs out
    if (!user && !loading) {
      connectionAttempted.current = false;
      socketService.disconnect();
      setConnectionState(SocketConnectionState.DISCONNECTED);
      setSocketError(null);
    }

    // Cleanup on unmount
    return () => {
      if (!user) {
        socketService.disconnect();
        setConnectionState(SocketConnectionState.DISCONNECTED);
        setSocketError(null);
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
          navigate('/login');
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
        {/* Enhanced socket status indicator */}
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          <ConnectionStatus status={connectionState} />
          {socketError && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded text-xs max-w-xs">
              <div className="font-medium">Connection Error</div>
              <div className="mt-1">{socketError}</div>
              <button
                onClick={() => {
                  setSocketError(null);
                  socketService.reconnect().catch(err => {
                    setSocketError(err.message || 'Reconnection failed');
                  });
                }}
                className="mt-2 text-red-600 hover:text-red-800 underline text-xs"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
        <Outlet />
      </div>
    </ChatProvider>
  );
};