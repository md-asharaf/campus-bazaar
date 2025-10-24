import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { healthService } from '@/services/health.service';
import { createQueryFn, handleApiError } from '@/utils/apiHelpers';
import { queryKeys } from './queryKeys';

// Types
type HealthResponse = {
  status: string;
  message: string;
  timestamp: string;
  uptime?: number;
  version?: string;
};

// PingResponse and ServerInfo types are handled by the service layer

type ConnectivityStatus = {
  isOnline: boolean;
  isApiReachable: boolean;
  lastChecked: string;
  latency?: number;
};

// Health Check Hook
export const useHealth = () => {
  return useQuery({
    queryKey: queryKeys.health.status(),
    queryFn: createQueryFn<HealthResponse>(healthService.checkHealth.bind(healthService)),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, _error: any) => {
      // Don't retry too aggressively for health checks
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

// API Status Hook (with ping functionality)
export const useApiStatus = () => {
  return useQuery({
    queryKey: queryKeys.health.api(),
    queryFn: async () => {
      const result = await healthService.ping();
      return result;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: false, // Don't retry ping failures
  });
};

// Server Info Hook
export const useServerInfo = () => {
  return useQuery({
    queryKey: ['health', 'server-info'],
    queryFn: async () => {
      const result = await healthService.getServerInfo();
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
};

// Connectivity Status Hook (client-side monitoring)
export const useConnectivityStatus = (options?: { pollingInterval?: number }) => {
  const { pollingInterval = 30000 } = options || {};
  
  return useQuery({
    queryKey: queryKeys.health.connectivity(),
    queryFn: async (): Promise<ConnectivityStatus> => {
      const startTime = Date.now();
      
      try {
        const response = await healthService.ping();
        const latency = Date.now() - startTime;
        
        return {
          isOnline: navigator.onLine,
          isApiReachable: response.success,
          lastChecked: new Date().toISOString(),
          latency,
        };
      } catch (error) {
        return {
          isOnline: navigator.onLine,
          isApiReachable: false,
          lastChecked: new Date().toISOString(),
        };
      }
    },
    staleTime: pollingInterval / 2,
    gcTime: pollingInterval * 2,
    refetchInterval: pollingInterval,
    retry: false,
  });
};

// Manual Health Check Hook
export const useManualHealthCheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await healthService.ping();
      return result;
    },
    onSuccess: (data) => {
      // Update the API status cache
      queryClient.setQueryData(queryKeys.health.api(), data);
      
      // Also update connectivity status
      queryClient.setQueryData(queryKeys.health.connectivity(), {
        isOnline: navigator.onLine,
        isApiReachable: data.success,
        lastChecked: new Date().toISOString(),
      });
    },
    onError: (error) => {
      console.error('Manual health check failed:', handleApiError(error));
    },
  });
};

// Hook for network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return {
    isOnline,
    isOffline: !isOnline,
  };
};

// Hook for health monitoring with alerts
export const useHealthMonitoring = (options?: {
  enableAlerts?: boolean;
  alertThreshold?: number;
  onHealthChange?: (isHealthy: boolean) => void;
}) => {
  const { enableAlerts = true, alertThreshold = 3, onHealthChange } = options || {};
  const [failureCount, setFailureCount] = useState(0);
  const [lastHealthStatus, setLastHealthStatus] = useState<boolean | null>(null);
  
  const { data: healthData, isError: healthError, error } = useHealth();
  const { data: connectivityData } = useConnectivityStatus();
  
  const isHealthy = !healthError && healthData?.status === 'OK' && connectivityData?.isApiReachable;
  
  useEffect(() => {
    if (isHealthy === lastHealthStatus) return;
    
    if (isHealthy) {
      setFailureCount(0);
    } else {
      setFailureCount(prev => prev + 1);
    }
    
    // Call callback if health status changed
    if (lastHealthStatus !== null && onHealthChange && isHealthy !== undefined) {
      onHealthChange(isHealthy);
    }
    
    if (isHealthy !== undefined) {
      setLastHealthStatus(isHealthy);
    }
  }, [isHealthy, lastHealthStatus, onHealthChange]);
  
  // Show alert if failures exceed threshold
  const shouldAlert = enableAlerts && failureCount >= alertThreshold;
  
  return {
    isHealthy,
    failureCount,
    shouldAlert,
    healthData,
    connectivityData,
    error: error ? handleApiError(error) : null,
  };
};

// Hook for health status badge/indicator
export const useHealthStatusIndicator = () => {
  const { data: healthData, isLoading: healthLoading, isError: healthError } = useHealth();
  const { data: connectivityData, isLoading: connectivityLoading } = useConnectivityStatus();
  const { isOnline } = useNetworkStatus();
  
  const getStatus = () => {
    if (healthLoading || connectivityLoading) {
      return {
        status: 'checking',
        color: 'yellow',
        message: 'Checking server status...',
      };
    }
    
    if (!isOnline) {
      return {
        status: 'offline',
        color: 'red',
        message: 'No internet connection',
      };
    }
    
    if (healthError || !connectivityData?.isApiReachable) {
      return {
        status: 'error',
        color: 'red',
        message: 'Server unavailable',
      };
    }
    
    if (healthData?.status === 'OK' && connectivityData?.isApiReachable) {
      return {
        status: 'healthy',
        color: 'green',
        message: 'All systems operational',
      };
    }
    
    return {
      status: 'warning',
      color: 'orange',
      message: 'Partial service availability',
    };
  };
  
  return {
    ...getStatus(),
    latency: connectivityData?.latency,
    lastChecked: connectivityData?.lastChecked,
  };
};

// Hook for prefetching health data
export const usePrefetchHealth = () => {
  const queryClient = useQueryClient();
  
  const prefetchHealth = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.health.status(),
      queryFn: createQueryFn<HealthResponse>(healthService.checkHealth.bind(healthService)),
      staleTime: 1 * 60 * 1000,
    });
  };
  
  const prefetchApiStatus = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.health.api(),
      queryFn: async () => {
        const result = await healthService.ping();
        return result;
      },
      staleTime: 30 * 1000,
    });
  };
  
  return { prefetchHealth, prefetchApiStatus };
};

// Hook for health metrics collection
export const useHealthMetrics = () => {
  const { data: healthData } = useHealth();
  const { data: connectivityData } = useConnectivityStatus();
  const { isOnline } = useNetworkStatus();
  
  const metrics = {
    serverUptime: healthData?.uptime,
    serverVersion: healthData?.version,
    apiLatency: connectivityData?.latency,
    networkStatus: isOnline ? 'online' : 'offline',
    serverStatus: healthData?.status || 'unknown',
    lastHealthCheck: healthData?.timestamp,
    lastConnectivityCheck: connectivityData?.lastChecked,
  };
  
  const exportMetrics = () => {
    return {
      ...metrics,
      exportedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  };
  
  return {
    metrics,
    exportMetrics,
  };
};