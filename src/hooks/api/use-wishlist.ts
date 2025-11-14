import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { wishlistService } from '@/services/wishlist.service';
import { createQueryFn, createMutationFn, handleApiError } from '@/utils/api-helpers';
import { queryKeys, getQueryKeysToInvalidate } from './query-keys';
import type { Wishlist, Item } from '@/types';

// Types
type AddToWishlistData = {
  itemId: string;
};

type WishlistResponse = {
  wishlist: Wishlist[];
  items: Item[];
};

type WishlistStatusResponse = {
  isInWishlist: boolean;
};

// Get User's Wishlist Hook
export const useWishlist = () => {
  return useQuery({
    queryKey: queryKeys.wishlist.my(),
    queryFn: createQueryFn<WishlistResponse>(wishlistService.getWishlist.bind(wishlistService)),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Check Wishlist Status Hook
export const useWishlistStatus = (itemId: string) => {
  return useQuery({
    queryKey: queryKeys.wishlist.item(itemId),
    queryFn: createQueryFn<WishlistStatusResponse>(() => wishlistService.checkWishlistStatus(itemId)),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!itemId,
  });
};

// Add to Wishlist Hook
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Wishlist, AddToWishlistData>(wishlistService.addToWishlist.bind(wishlistService)),
    onSuccess: (_, variables) => {
      // Update wishlist status for this item
      queryClient.setQueryData(
        queryKeys.wishlist.item(variables.itemId),
        { isInWishlist: true }
      );

      // Invalidate and refetch wishlist
      getQueryKeysToInvalidate.onWishlistChange(variables.itemId).forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });

      toast.success('Added to wishlist!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to add to wishlist: ${message}`);
    },
  });
};

// Remove from Wishlist Hook
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<{ message: string }, string>(wishlistService.removeFromWishlist.bind(wishlistService)),
    onSuccess: (_, itemId) => {
      // Update wishlist status for this item
      queryClient.setQueryData(
        queryKeys.wishlist.item(itemId),
        { isInWishlist: false }
      );

      // Remove from wishlist cache optimistically
      queryClient.setQueryData(
        queryKeys.wishlist.my(),
        (oldData: WishlistResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            wishlist: oldData.wishlist.filter(item => item.itemId !== itemId),
            items: oldData.items.filter(item => item.id !== itemId),
          };
        }
      );

      // Invalidate queries
      getQueryKeysToInvalidate.onWishlistChange(itemId).forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });

      toast.success('Removed from wishlist!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to remove from wishlist: ${message}`);
    },
  });
};

// Toggle Wishlist Hook (add or remove based on current status)
export const useToggleWishlist = () => {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      // Fetch the current status from the API to avoid race conditions with cached data.
      const currentStatus = await queryClient.fetchQuery<WishlistStatusResponse>({
        queryKey: queryKeys.wishlist.item(itemId),
      });

      if (currentStatus?.isInWishlist) {
        return removeFromWishlist.mutateAsync(itemId);
      } else {
        return addToWishlist.mutateAsync({ itemId });
      }
    },
    onSuccess: (_, itemId) => {
      // Invalidate to ensure both wishlist and item status are fresh.
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.my() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.item(itemId) });
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Wishlist action failed: ${message}`);
    },
  });
};

// Hook to get wishlist items count
export const useWishlistCount = () => {
  const { data: wishlistData } = useWishlist();
  return wishlistData?.wishlist?.length || 0;
};

// Hook to check if multiple items are in wishlist
export const useMultipleWishlistStatus = (itemIds: string[]) => {
  return useQuery({
    queryKey: ['wishlist', 'multiple-status', itemIds],
    queryFn: async () => {
      const promises = itemIds.map(id => wishlistService.checkWishlistStatus(id));
      const results = await Promise.all(promises);
      
      return itemIds.reduce((acc, itemId, index) => {
        acc[itemId] = results[index].isInWishlist;
        return acc;
      }, {} as Record<string, boolean>);
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: itemIds.length > 0,
  });
};

// Hook for optimistic wishlist updates
export const useOptimisticWishlist = () => {
  const queryClient = useQueryClient();
  
  const addOptimistically = (itemId: string, item?: Item) => {
    // Update status
    queryClient.setQueryData(
      queryKeys.wishlist.item(itemId),
      { isInWishlist: true }
    );

    // Add to wishlist if item data is available
    if (item) {
      queryClient.setQueryData(
        queryKeys.wishlist.my(),
        (oldData: WishlistResponse | undefined) => {
          if (!oldData) {
            return {
              wishlist: [{ id: `temp-${itemId}`, userId: 'optimistic-user', itemId, createdAt: new Date().toISOString() }],
              items: [item],
            };
          }
          
          // Check if already exists
          if (oldData.wishlist.some(w => w.itemId === itemId)) {
            return oldData;
          }

          return {
            wishlist: [...oldData.wishlist, { 
              id: `temp-${itemId}`, 
              userId: 'optimistic-user', 
              itemId, 
              createdAt: new Date().toISOString() 
            }],
            items: [...oldData.items, item],
          };
        }
      );
    }
  };

  const removeOptimistically = (itemId: string) => {
    // Update status
    queryClient.setQueryData(
      queryKeys.wishlist.item(itemId),
      { isInWishlist: false }
    );

    // Remove from wishlist
    queryClient.setQueryData(
      queryKeys.wishlist.my(),
      (oldData: WishlistResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          wishlist: oldData.wishlist.filter(w => w.itemId !== itemId),
          items: oldData.items.filter(item => item.id !== itemId),
        };
      }
    );
  };

  const rollbackWishlist = (itemId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.item(itemId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.my() });
  };

  return { 
    addOptimistically, 
    removeOptimistically, 
    rollbackWishlist 
  };
};

// Hook to prefetch wishlist data
export const usePrefetchWishlist = () => {
  const queryClient = useQueryClient();
  
  const prefetchWishlist = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.wishlist.my(),
      queryFn: createQueryFn<WishlistResponse>(wishlistService.getWishlist.bind(wishlistService)),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchWishlistStatus = (itemId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.wishlist.item(itemId),
      queryFn: createQueryFn<WishlistStatusResponse>(() => wishlistService.checkWishlistStatus(itemId)),
      staleTime: 1 * 60 * 1000,
    });
  };

  return { prefetchWishlist, prefetchWishlistStatus };
};

// Hook to get wishlist items with additional data
export const useWishlistItems = () => {
  const { data, isLoading, error } = useWishlist();
  
  const items = data?.items || [];
  const wishlistEntries = data?.wishlist || [];
  
  // Combine wishlist metadata with item data
  const wishlistItems = items.map(item => {
    const wishlistEntry = wishlistEntries.find(w => w.itemId === item.id);
    return {
      ...item,
      addedToWishlistAt: wishlistEntry?.createdAt,
      wishlistId: wishlistEntry?.id,
    };
  });

  return {
    items: wishlistItems,
    count: items.length,
    isLoading,
    error,
  };
};