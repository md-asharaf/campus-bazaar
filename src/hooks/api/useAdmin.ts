import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import { createQueryFn, createMutationFn, handleApiError } from '@/utils/apiHelpers';
import { queryKeys, getQueryKeysToInvalidate } from './queryKeys';
import type { User, Item, Category, Feedback, Verification } from '@/types';

// Types
type CreateCategoryData = {
  name: string;
  image?: File;
};

type UpdateCategoryData = {
  name?: string;
  image?: File;
};

type UpdateUserData = {
  name?: string;
  email?: string;
  bio?: string;
  phone?: string;
  branch?: string;
  year?: number;
  isActive?: boolean;
  isVerified?: boolean;
};

type UpdateItemData = {
  title?: string;
  price?: number;
  categoryId?: string;
  isVerified?: boolean;
  isSold?: boolean;
};

type UpdateVerificationData = {
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
};

type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  isVerified?: boolean;
  isActive?: boolean;
};

type GetItemsParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isVerified?: boolean;
  isSold?: boolean;
};

type GetFeedbackParams = {
  page?: number;
  limit?: number;
  rating?: number;
};

type GetVerificationsParams = {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// User Management Hooks
export const useAdminUsers = (params: GetUsersParams & { enabled?: boolean } = {}) => {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: queryKeys.admin.users.list(queryParams),
    queryFn: createQueryFn<PaginatedResponse<User>>(() => adminService.getAllUsers(queryParams)),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAdminUser = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.users.detail(userId),
    queryFn: createQueryFn<User>(() => adminService.getUserById(userId)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!userId,
  });
};

export const useUpdateUserAsAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<User, { userId: string; data: UpdateUserData }>(
      ({ userId, data }) => adminService.updateUser(userId, data)
    ),
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(queryKeys.admin.users.detail(variables.userId), data);
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.lists() });
      
      // Invalidate dashboard stats
      getQueryKeysToInvalidate.onAdminUserAction().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success('User updated successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to update user: ${message}`);
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<User, string>(adminService.toggleUserStatus.bind(adminService)),
    onSuccess: (data, userId) => {
      // Update the specific user in cache
      queryClient.setQueryData(queryKeys.admin.users.detail(userId), data);
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.lists() });
      
      // Invalidate dashboard stats
      getQueryKeysToInvalidate.onAdminUserAction().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success(`User ${data.isActive ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to toggle user status: ${message}`);
    },
  });
};

export const useDeleteUserAsAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<{ message: string }, string>(adminService.deleteUser.bind(adminService)),
    onSuccess: (_, userId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: queryKeys.admin.users.detail(userId) });
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.lists() });
      
      // Invalidate dashboard stats
      getQueryKeysToInvalidate.onAdminUserAction().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to delete user: ${message}`);
    },
  });
};

// Verification Management Hooks
export const useAdminVerifications = (params: GetVerificationsParams & { enabled?: boolean } = {}) => {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: queryKeys.admin.verification.list(queryParams),
    queryFn: createQueryFn<PaginatedResponse<Verification>>(() => adminService.getAllVerifications(queryParams)),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminVerification = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.verification.detail(userId),
    queryFn: createQueryFn<Verification>(() => adminService.getVerification(userId)),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId,
  });
};

export const useUpdateVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Verification, { id: string; data: UpdateVerificationData }>(
      ({ id, data }) => adminService.updateVerification(id, data)
    ),
    onSuccess: (data, variables) => {
      // Update verification cache
      queryClient.setQueryData(queryKeys.admin.verification.detail(variables.id), data);
      
      // Invalidate verifications list
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.verification.lists() });
      
      // Invalidate dashboard stats
      getQueryKeysToInvalidate.onAdminVerificationAction().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success(`Verification ${data.status.toLowerCase()} successfully`);
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to update verification: ${message}`);
    },
  });
};

// Item Management Hooks
export const useAdminItems = (params: GetItemsParams & { enabled?: boolean } = {}) => {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: queryKeys.admin.items.list(queryParams),
    queryFn: createQueryFn<PaginatedResponse<Item>>(() => adminService.getAllItems(queryParams)),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAdminItem = (itemId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.items.detail(itemId),
    queryFn: createQueryFn<Item>(() => adminService.getItemById(itemId)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!itemId,
  });
};

export const useUpdateItemAsAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Item, { itemId: string; data: UpdateItemData }>(
      ({ itemId, data }) => adminService.updateItem(itemId, data)
    ),
    onSuccess: (data, variables) => {
      // Update item cache
      queryClient.setQueryData(queryKeys.admin.items.detail(variables.itemId), data);
      queryClient.setQueryData(queryKeys.items.detail(variables.itemId), data);
      
      // Invalidate items lists
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.items.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.items.lists() });
      
      // Invalidate dashboard stats
      getQueryKeysToInvalidate.onAdminItemAction().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success('Item updated successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to update item: ${message}`);
    },
  });
};

export const useVerifyItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Item, string>(adminService.verifyItem.bind(adminService)),
    onSuccess: (data, itemId) => {
      // Update item cache
      queryClient.setQueryData(queryKeys.admin.items.detail(itemId), data);
      queryClient.setQueryData(queryKeys.items.detail(itemId), data);
      
      // Invalidate items lists
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.items.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.items.lists() });
      
      toast.success('Item verified successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to verify item: ${message}`);
    },
  });
};

export const useRejectItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Item, string>(adminService.rejectItem.bind(adminService)),
    onSuccess: (data, itemId) => {
      // Update item cache
      queryClient.setQueryData(queryKeys.admin.items.detail(itemId), data);
      queryClient.setQueryData(queryKeys.items.detail(itemId), data);
      
      // Invalidate items lists
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.items.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.items.lists() });
      
      toast.success('Item rejected successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to reject item: ${message}`);
    },
  });
};

export const useDeleteItemAsAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<{ message: string }, string>(adminService.deleteItem.bind(adminService)),
    onSuccess: (_, itemId) => {
      // Remove item from cache
      queryClient.removeQueries({ queryKey: queryKeys.admin.items.detail(itemId) });
      queryClient.removeQueries({ queryKey: queryKeys.items.detail(itemId) });
      
      // Invalidate items lists
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.items.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.items.lists() });
      
      toast.success('Item deleted successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to delete item: ${message}`);
    },
  });
};

// Category Management Hooks
export const useAdminCategories = () => {
  return useQuery({
    queryKey: queryKeys.admin.categories.lists(),
    queryFn: createQueryFn<Category[]>(adminService.getAllCategories.bind(adminService)),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useAdminCategory = (categoryId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.categories.detail(categoryId),
    queryFn: createQueryFn<Category>(() => adminService.getCategoryById(categoryId)),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!categoryId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Category, CreateCategoryData>(adminService.createCategory.bind(adminService)),
    onSuccess: (_) => {
      // Invalidate categories lists
      getQueryKeysToInvalidate.onAdminCategoryAction().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success('Category created successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to create category: ${message}`);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Category, { categoryId: string; data: UpdateCategoryData }>(
      ({ categoryId, data }) => adminService.updateCategory(categoryId, data)
    ),
    onSuccess: (data, variables) => {
      // Update category cache
      queryClient.setQueryData(queryKeys.admin.categories.detail(variables.categoryId), data);
      queryClient.setQueryData(queryKeys.categories.detail(variables.categoryId), data);
      
      // Invalidate categories lists
      getQueryKeysToInvalidate.onAdminCategoryAction().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to update category: ${message}`);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<{ message: string }, string>(adminService.deleteCategory.bind(adminService)),
    onSuccess: (_, categoryId) => {
      // Remove category from cache
      queryClient.removeQueries({ queryKey: queryKeys.admin.categories.detail(categoryId) });
      queryClient.removeQueries({ queryKey: queryKeys.categories.detail(categoryId) });
      
      // Invalidate categories lists
      getQueryKeysToInvalidate.onAdminCategoryAction().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to delete category: ${message}`);
    },
  });
};

// Feedback Management Hooks
export const useAdminFeedback = (params: GetFeedbackParams = {}) => {
  return useQuery({
    queryKey: queryKeys.admin.feedback.list(params),
    queryFn: createQueryFn<PaginatedResponse<Feedback>>(() => adminService.getAllFeedback(params)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useAdminFeedbackItem = (feedbackId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.feedback.detail(feedbackId),
    queryFn: createQueryFn<Feedback>(() => adminService.getFeedbackById(feedbackId)),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!feedbackId,
  });
};

export const useDeleteFeedbackAsAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<{ message: string }, string>(adminService.deleteFeedback.bind(adminService)),
    onSuccess: (_, feedbackId) => {
      // Remove feedback from cache
      queryClient.removeQueries({ queryKey: queryKeys.admin.feedback.detail(feedbackId) });
      
      // Invalidate feedback lists
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.feedback.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback.lists() });
      
      toast.success('Feedback deleted successfully');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to delete feedback: ${message}`);
    },
  });
};

// Dashboard Stats Types
type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  totalItems: number;
  verifiedItems: number;
  soldItems: number;
  totalCategories: number;
  pendingVerifications: number;
  totalFeedback: number;
  recentItems: number;
  itemGrowth: number;
  inactiveUsers: number;
  unverifiedUsers: number;
  availableItems: number;
  unverifiedItems: number;
};

// Dashboard Stats Hook
export const useAdminDashboardStats = (options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: queryKeys.admin.dashboard.stats(),
    queryFn: createQueryFn<DashboardStats>(() => adminService.getDashboardStats()),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Bulk Actions Hook
export const useBulkUserActions = () => {
  const queryClient = useQueryClient();

  const bulkToggleUserStatus = useMutation({
    mutationFn: async (userIds: string[]) => {
      const results = await Promise.allSettled(
        userIds.map(id => adminService.toggleUserStatus(id))
      );
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all() });
      toast.success('Bulk user status update completed');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Bulk action failed: ${message}`);
    },
  });

  const bulkDeleteUsers = useMutation({
    mutationFn: async (userIds: string[]) => {
      const results = await Promise.allSettled(
        userIds.map(id => adminService.deleteUser(id))
      );
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all() });
      toast.success('Bulk user deletion completed');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Bulk deletion failed: ${message}`);
    },
  });

  return {
    bulkToggleUserStatus,
    bulkDeleteUsers,
  };
};