// Main API hooks index - centralized exports for React Query integration
// This file exports all hooks for easy importing throughout the application

// Query Keys
export { queryKeys, getQueryKeysToInvalidate } from './queryKeys';

// Auth hooks
export {
  useRegister,
  useLogout,
  useRefreshTokens,
  useGoogleAuth,
  useGoogleAuthCallback,
  useAdminLogin,
  useAdminVerifyLogin,
} from './useAuth';

// Profile hooks
export {
  useProfile,
  useUpdateProfile,
  useVerifyUser,
  useProfileStatus,
  usePrefetchProfile,
  useOptimisticProfileUpdate,
} from './useProfile';

// Items hooks
export {
  useMyItems,
  useSearchItems,
  useInfiniteSearchItems,
  useItem,
  useCreateItem,
  useUpdateItem,
  useMarkItemAsSold,
  useDeleteItem,
  usePrefetchItem,
  useItemsByCategory,
  useRecentItems,
  useItemsByPriceRange,
  useOptimisticItemUpdate,
} from './useItems';

// Categories hooks
export {
  useCategories,
  useCategory,
  useCategoryOptions,
  usePrefetchCategory,
  useCategoryName,
  useCategoriesWithCounts,
  useFilteredCategories,
} from './useCategories';

// Wishlist hooks
export {
  useWishlist,
  useWishlistStatus,
  useAddToWishlist,
  useRemoveFromWishlist,
  useToggleWishlist,
  useWishlistCount,
  useMultipleWishlistStatus,
  useOptimisticWishlist,
  usePrefetchWishlist,
  useWishlistItems,
} from './useWishlist';

// Feedback hooks
export {
  useMyFeedback,
  useCreateFeedback,
  useUpdateFeedback,
  useDeleteFeedback,
  useFeedbackStatus,
  useOptimisticFeedback,
  usePrefetchFeedback,
  useSubmitFeedback,
  useFeedbackValidation,
} from './useFeedback';

// Search hooks
export {
  useSearch,
  useSearchSuggestions,
  useSearchFilters,
  useDebouncedSearch,
  useSearchHistory,
  usePopularSearches,
  useTrendingSearches,
  usePrefetchSearch,
  useAdvancedSearch,
  useSearchAnalytics,
} from './useSearch';

// Chat hooks
export {
  useMyChats,
  useConversations,
  useChatMessages,
  useCreateOrGetChat,
  useSendImageMessage,
  useFlatChatMessages,
  useMarkMessagesAsRead,
  useUnreadMessageCount,
  useOptimisticMessage,
  usePrefetchChat,
  useChatRealtime,
} from './useChat';

// Admin hooks
export {
  // User management
  useAdminUsers,
  useAdminUser,
  useUpdateUserAsAdmin,
  useToggleUserStatus,
  useDeleteUserAsAdmin,

  // Verification management
  useAdminVerifications,
  useAdminVerification,
  useUpdateVerification,

  // Item management
  useAdminItems,
  useAdminItem,
  useUpdateItemAsAdmin,
  useVerifyItem,
  useRejectItem,
  useDeleteItemAsAdmin,

  // Category management
  useAdminCategories,
  useAdminCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,

  // Feedback management
  useAdminFeedback,
  useAdminFeedbackItem,
  useDeleteFeedbackAsAdmin,

  // Dashboard and utilities
  useAdminDashboardStats,
  useBulkUserActions,
} from './useAdmin';

// Health hooks
export {
  useHealth,
  useApiStatus,
  useServerInfo,
  useConnectivityStatus,
  useManualHealthCheck,
  useNetworkStatus,
  useHealthMonitoring,
  useHealthStatusIndicator,
  usePrefetchHealth,
  useHealthMetrics,
} from './useHealth';

// Type exports for convenience
export type { QueryKey } from '@tanstack/react-query';

// Re-export commonly used React Query hooks for convenience
export {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useIsFetching,
  useIsMutating,
} from '@tanstack/react-query';

// Utility types for hooks
export type HookOptions = {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
};

export type MutationOptions<TData = unknown, TVariables = unknown> = {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onMutate?: (variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void;
};

// Helper function to create consistent query options
export const createQueryOptions = <TData = unknown>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: HookOptions
) => ({
  queryKey,
  queryFn,
  staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
  gcTime: options?.gcTime ?? 30 * 60 * 1000, // 30 minutes default
  retry: options?.retry ?? 3,
  enabled: options?.enabled ?? true,
  refetchInterval: options?.refetchInterval,
  refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
  refetchOnMount: options?.refetchOnMount ?? true,
});

// Helper function to create consistent mutation options
export const createMutationOptions = <TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData, TVariables>
) => ({
  mutationFn,
  onSuccess: options?.onSuccess,
  onError: options?.onError,
  onMutate: options?.onMutate,
  onSettled: options?.onSettled,
});

// Constants for common stale times
export const STALE_TIMES = {
  NEVER: Infinity,
  ONE_MINUTE: 1 * 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const;

// Constants for common garbage collection times
export const GC_TIMES = {
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  TWO_HOURS: 2 * 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const;