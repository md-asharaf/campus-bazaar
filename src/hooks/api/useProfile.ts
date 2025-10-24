import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getMe,
  update,
  verify,
} from '@/services/profile.service';
import { createQueryFn, createMutationFn, handleApiError } from '@/utils/apiHelpers';
import { queryKeys, getQueryKeysToInvalidate } from './queryKeys';
import type { User } from '@/types';

// Types
type UpdateProfileData = {
  name?: string;
  bio?: string | null;
  phone?: string;
  avatar?: File | null;
};

type VerifyUserData = {
  verificationImage: File;
};

// Get Current User Profile Hook
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: createQueryFn<User>(getMe),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors (authentication issues)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Update User Profile Hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<User, UpdateProfileData>(update),
    onSuccess: (data) => {
      // Update the profile cache
      queryClient.setQueryData(queryKeys.profile.me(), data);

      // Invalidate related queries
      getQueryKeysToInvalidate.onProfileUpdate().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });

      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to update profile: ${message}`);
    },
  });
};

// Verify User Hook (submit verification documents)
export const useVerifyUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<null, VerifyUserData>((data) => verify(data.verificationImage)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });

      toast.success('Verification submitted successfully. Please wait for admin approval.');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Verification submission failed: ${message}`);
    },
  });
};

// Hook to get profile loading state
export const useProfileStatus = () => {
  const { data: user, isLoading, error, isError } = useProfile();

  return {
    user,
    isLoading,
    isError,
    error,
    isVerified: user?.isVerified || false,
    isActive: user?.isActive || false,
    hasProfile: !!user,
  };
};

// Hook to prefetch profile data
export const usePrefetchProfile = () => {
  const queryClient = useQueryClient();

  const prefetchProfile = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.profile.me(),
      queryFn: createQueryFn<User>(getMe),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchProfile };
};

// Hook to optimistically update profile data
export const useOptimisticProfileUpdate = () => {
  const queryClient = useQueryClient();

  const updateProfileOptimistically = (updates: Partial<User>) => {
    queryClient.setQueryData(
      queryKeys.profile.me(),
      (oldData: User | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...updates };
      }
    );
  };

  const rollbackProfileUpdate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
  };

  return { updateProfileOptimistically, rollbackProfileUpdate };
};