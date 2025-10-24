import { useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { createQueryFn } from '@/utils/apiHelpers';
import { queryKeys } from './queryKeys';
import type { Category } from '@/types';

type CatgeoriesResponse = {
  categories: Category[];
  total: number;
  page: number;
  totalPages: number;
};
// Get All Categories Hook
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: createQueryFn<CatgeoriesResponse>(categoryService.getAllCategories),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get Category By ID Hook
export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId),
    queryFn: createQueryFn<Category>(() => categoryService.getCategoryById(categoryId)),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!categoryId,
  });
};

// Hook to get categories as options for forms/selects
export const useCategoryOptions = () => {
  const { data, isLoading, error } = useCategories();

  const options = data?.categories?.map(category => ({
    value: category.id,
    label: category.name,
    imageUrl: category.image?.url,
  })) || [];

  return {
    options,
    categories: data?.categories || [],
    isLoading,
    error,
  };
};

// Hook to prefetch category data
export const usePrefetchCategory = () => {
  const queryClient = useQueryClient();

  const prefetchCategory = (categoryId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.detail(categoryId),
      queryFn: createQueryFn<Category>(() => categoryService.getCategoryById(categoryId)),
      staleTime: 10 * 60 * 1000,
    });
  };

  const prefetchCategories = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.lists(),
      queryFn: createQueryFn<Category[]>(categoryService.getAllCategories.bind(categoryService)),
      staleTime: 10 * 60 * 1000,
    });
  };

  return { prefetchCategory, prefetchCategories };
};

// Hook to get category name by ID
export const useCategoryName = (categoryId?: string) => {
  const { data } = useCategories();

  const categoryName = categoryId
    ? data?.categories?.find(cat => cat.id === categoryId)?.name
    : undefined;

  return categoryName;
};

// Hook to get categories with item counts (if available)
export const useCategoriesWithCounts = () => {
  const { data, ...rest } = useCategories();

  const categoriesWithCounts = data?.categories?.map(category => ({
    ...category,
    itemCount: category.items?.length || 0,
  }));

  return {
    data: categoriesWithCounts,
    categories: categoriesWithCounts,
    ...rest,
  };
};

// Hook for category search/filtering
export const useFilteredCategories = (searchTerm?: string) => {
  const { data, ...rest } = useCategories();

  const filteredCategories = searchTerm
    ? data?.categories?.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data?.categories;

  return {
    data: filteredCategories,
    categories: filteredCategories,
    ...rest,
  };
};