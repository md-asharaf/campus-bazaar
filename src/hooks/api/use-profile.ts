import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getMe,
  update,
  verify,
} from '@/services/profile.service';
import { createQueryFn, createMutationFn, handleApiError } from '@/utils/api-helpers';
import { queryKeys, getQueryKeysToInvalidate } from './query-keys';
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