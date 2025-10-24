import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  register,
  logout,
  refreshTokens,
  googleAuth,
  handleGoogleCallback,
  adminLogin,
  adminVerifyLogin,
} from '@/services/auth.service';
import { createMutationFn, handleApiError } from '@/utils/apiHelpers';
import { queryKeys } from './queryKeys';
import type { User } from '@/types';

// Types
type RegisterData = {
  email: string;
  bio?: string | null;
  phone?: string | null;
  registrationNo: string;
  branch: string;
  year: number;
};

type AdminLoginData = {
  email: string;
};

type AdminVerifyLoginData = {
  email: string;
  otp: string;
};

type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

type AdminAuthResponse = {
  accessToken: string;
  refreshToken: string;
};

// User Registration Hook
export const useRegister = () => {
  return useMutation({
    mutationFn: createMutationFn<AuthResponse, RegisterData>(register),
    onSuccess: () => {
      toast.success('Registration successful! Welcome to Campus Bazaar!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(message);
    },
  });
};

// User Logout Hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<{ message: string }, void>(logout),
    onSuccess: () => {
      toast.success('Logged out successfully');
    },
    onError: (error) => {
      queryClient.clear();
      const message = handleApiError(error);
      toast.error(`Logout error: ${message}`);
    },
  });
};

// Refresh Tokens Hook
export const useRefreshTokens = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<AuthResponse, void>(refreshTokens),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile.me(), data.user);
    },
    onError: (error) => {
      queryClient.clear();

      const message = handleApiError(error);
      toast.error(`Session expired: ${message}`);
    },
  });
};

// Google Auth Hook (initiates OAuth flow)
export const useGoogleAuth = () => {
  return useMutation({
    mutationFn: () => {
      googleAuth();
      return Promise.resolve({ message: 'Redirecting to Google...' });
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Google Auth error: ${message}`);
    },
  });
};

// Google Auth Callback Hook
export const useGoogleAuthCallback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<AuthResponse, string>(handleGoogleCallback),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile.me(), data.user);

      toast.success('Google authentication successful!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Google authentication failed: ${message}`);
    },
  });
};

// Admin Login Hook
export const useAdminLogin = () => {
  return useMutation({
    mutationFn: createMutationFn<null, AdminLoginData>(adminLogin),
    onSuccess: () => {
      toast.success('OTP sent to your email');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Admin login failed: ${message}`);
    },
  });
};

// Admin Verify Login Hook
export const useAdminVerifyLogin = () => {

  return useMutation({
    mutationFn: createMutationFn<AdminAuthResponse, AdminVerifyLoginData>(adminVerifyLogin),
    onSuccess: () => {
      localStorage.setItem('userRole', 'admin');
      toast.success('Admin login successful!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Admin verification failed: ${message}`);
    },
  });
};