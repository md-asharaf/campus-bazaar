import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { itemService } from '@/services/item.service';
import { createQueryFn, createMutationFn, handleApiError } from '@/utils/api-helpers';
import { queryKeys, getQueryKeysToInvalidate } from './query-keys';
import type { Item } from '@/types';

// Types
type CreateItemData = {
  title: string;
  price: number;
  categoryId?: string;
  image: File;
};

type UpdateItemData = {
  title?: string;
  price?: number;
  categoryId?: string;
};

type SearchParams = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

type ItemsResponse = {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
};

// Get My Items Hook
export const useMyItems = (options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: queryKeys.items.my(),
    queryFn: createQueryFn<ItemsResponse>(itemService.getMyItems),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search Items Hook
export const useSearchItems = (params: SearchParams = {}) => {
  return useQuery({
    queryKey: queryKeys.items.search(params.q, params),
    queryFn: createQueryFn<ItemsResponse>(() => itemService.searchItems(params)),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Always fetch items, even without search query
  });
};

// Infinite Search Items Hook (for pagination)
export const useInfiniteSearchItems = (baseParams: Omit<SearchParams, 'page'> = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.items.search(baseParams.q, baseParams),
    queryFn: ({ pageParam = 1 }) => {
      const params = { ...baseParams, page: pageParam };
      return createQueryFn<ItemsResponse>(() => itemService.searchItems(params))();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Get Item By ID Hook
export const useItem = (itemId: string) => {
  return useQuery({
    queryKey: queryKeys.items.detail(itemId),
    queryFn: createQueryFn<Item>(() => itemService.getItemById(itemId)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!itemId,
  });
};

// Create Item Hook
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Item, CreateItemData>(itemService.createItem.bind(itemService)),
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      getQueryKeysToInvalidate.onItemChange(data.id).forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });

      // Optimistically add to my items list
      queryClient.setQueryData(
        queryKeys.items.my(),
        (oldData: Item[] | undefined) => {
          if (!oldData) return [data];
          return [data, ...oldData];
        }
      );

      toast.success('Item created successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to create item: ${message}`);
    },
  });
};

// Update Item Hook
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Item, { itemId: string; data: UpdateItemData }>(
      ({ itemId, data }) => itemService.updateMyItem(itemId, data)
    ),
    onSuccess: (data, variables) => {
      // Update the specific item in cache
      queryClient.setQueryData(queryKeys.items.detail(variables.itemId), data);

      // Update the item in my items list
      queryClient.setQueryData(
        queryKeys.items.my(),
        (oldData: Item[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(item => item.id === variables.itemId ? data : item);
        }
      );

      // Invalidate search results
      queryClient.invalidateQueries({ queryKey: queryKeys.items.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.search.all });

      toast.success('Item updated successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to update item: ${message}`);
    },
  });
};

// Mark Item as Sold Hook
export const useMarkItemAsSold = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<Item, string>(itemService.markItemAsSold.bind(itemService)),
    onSuccess: (data, itemId) => {
      // Update the specific item in cache
      queryClient.setQueryData(queryKeys.items.detail(itemId), data);

      // Update the item in my items list
      queryClient.setQueryData(
        queryKeys.items.my(),
        (oldData: Item[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(item => item.id === itemId ? { ...item, isSold: true } : item);
        }
      );

      // Invalidate search results
      queryClient.invalidateQueries({ queryKey: queryKeys.items.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.search.all });

      toast.success('Item marked as sold!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to mark item as sold: ${message}`);
    },
  });
};

// Delete Item Hook
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMutationFn<{ message: string }, string>(itemService.deleteMyItem.bind(itemService)),
    onSuccess: (_, itemId) => {
      // Remove from my items list
      queryClient.setQueryData(
        queryKeys.items.my(),
        (oldData: Item[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(item => item.id !== itemId);
        }
      );

      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.items.detail(itemId) });

      // Invalidate search results
      queryClient.invalidateQueries({ queryKey: queryKeys.items.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.search.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });

      toast.success('Item deleted successfully!');
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to delete item: ${message}`);
    },
  });
};

// Hook to prefetch item details
export const usePrefetchItem = () => {
  const queryClient = useQueryClient();

  const prefetchItem = (itemId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.items.detail(itemId),
      queryFn: createQueryFn<Item>(() => itemService.getItemById(itemId)),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchItem };
};

// Hook to get items by category
export const useItemsByCategory = (categoryId?: string) => {
  return useSearchItems({ category: categoryId });
};

// Hook to get recent items
export const useRecentItems = (limit: number = 10) => {
  return useSearchItems({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit
  });
};

// Hook to get items in price range
export const useItemsByPriceRange = (minPrice?: number, maxPrice?: number) => {
  return useSearchItems({ minPrice, maxPrice });
};

// Hook for optimistic item updates
export const useOptimisticItemUpdate = () => {
  const queryClient = useQueryClient();

  const updateItemOptimistically = (itemId: string, updates: Partial<Item>) => {
    // Update in detail cache
    queryClient.setQueryData(
      queryKeys.items.detail(itemId),
      (oldData: Item | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...updates };
      }
    );

    // Update in my items list
    queryClient.setQueryData(
      queryKeys.items.my(),
      (oldData: Item[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        );
      }
    );
  };

  const rollbackItemUpdate = (itemId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.items.detail(itemId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.items.my() });
  };

  return { updateItemOptimistically, rollbackItemUpdate };
};