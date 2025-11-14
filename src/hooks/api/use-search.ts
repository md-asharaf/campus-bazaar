import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { searchService } from '@/services/search.service';
import { createQueryFn } from '@/utils/api-helpers';
import { queryKeys } from './query-keys';
import type { Item } from '@/types';

// Types
type SearchParams = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'relevance';
  sortOrder?: 'asc' | 'desc';
};

// Removed SuggestionParams type as it's not used directly

type SearchResponse = {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type SuggestionsResponse = {
  suggestions: string[];
  items: Item[];
};

type SearchFilters = {
  categories: Array<{ id: string; name: string; count: number }>;
  priceRanges: Array<{ min: number; max: number; count: number }>;
  sortOptions: Array<{ value: string; label: string }>;
};

// Main Search Hook
export const useSearch = (params: SearchParams = {}) => {
  return useQuery({
    queryKey: queryKeys.search.items(params.q || '', params),
    queryFn: createQueryFn<SearchResponse>(() => searchService.search(params)),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!params.q || Object.keys(params).length > 1, // Enable if query or other params exist
  });
};

// Search Suggestions Hook
export const useSearchSuggestions = (query: string, options?: { limit?: number }) => {
  return useQuery({
    queryKey: queryKeys.search.suggestions(query),
    queryFn: createQueryFn<SuggestionsResponse>(() => 
      searchService.getSuggestions({ q: query, limit: options?.limit })
    ),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: query.length >= 2, // Only search after 2 characters
  });
};

// Search Filters Hook (mock implementation - would need backend support)
export const useSearchFilters = () => {
  return useQuery({
    queryKey: queryKeys.search.filters(),
    queryFn: async (): Promise<SearchFilters> => {
      // This would typically call a real API endpoint
      return {
        categories: [],
        priceRanges: [
          { min: 0, max: 1000, count: 0 },
          { min: 1000, max: 5000, count: 0 },
          { min: 5000, max: 10000, count: 0 },
          { min: 10000, max: Infinity, count: 0 },
        ],
        sortOptions: [
          { value: 'relevance', label: 'Most Relevant' },
          { value: 'createdAt-desc', label: 'Newest First' },
          { value: 'createdAt-asc', label: 'Oldest First' },
          { value: 'price-asc', label: 'Price: Low to High' },
          { value: 'price-desc', label: 'Price: High to Low' },
        ],
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for debounced search
export const useDebouncedSearch = (query: string, delay: number = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return useSearch({ q: debouncedQuery });
};

// Hook for search history (client-side storage)
export const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('search-history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = (query: string) => {
    if (!query.trim() || query.length < 2) return;

    setHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      const updated = [query, ...filtered].slice(0, 10); // Keep last 10 searches
      
      try {
        localStorage.setItem('search-history', JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('search-history');
    } catch {
      // Ignore localStorage errors
    }
  };

  const removeFromHistory = (query: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item !== query);
      try {
        localStorage.setItem('search-history', JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
};

// Hook for popular searches (mock implementation)
export const usePopularSearches = () => {
  return useQuery({
    queryKey: ['search', 'popular'],
    queryFn: async (): Promise<string[]> => {
      // This would typically call a real API endpoint
      return [
        'iPhone',
        'Laptop',
        'Books',
        'Electronics',
        'Furniture',
        'Clothes',
        'Bicycle',
        'Camera',
      ];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Hook for trending searches (mock implementation)
export const useTrendingSearches = () => {
  return useQuery({
    queryKey: ['search', 'trending'],
    queryFn: async (): Promise<string[]> => {
      // This would typically call a real API endpoint
      return [
        'MacBook Pro',
        'Gaming Chair',
        'Textbooks',
        'Smartphone',
        'Study Desk',
      ];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook to prefetch search results
export const usePrefetchSearch = () => {
  const queryClient = useQueryClient();
  
  const prefetchSearch = (params: SearchParams) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.search.items(params.q || '', params),
      queryFn: createQueryFn<SearchResponse>(() => searchService.search(params)),
      staleTime: 30 * 1000,
    });
  };

  const prefetchSuggestions = (query: string) => {
    if (query.length >= 2) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.search.suggestions(query),
        queryFn: createQueryFn<SuggestionsResponse>(() => 
          searchService.getSuggestions({ q: query })
        ),
        staleTime: 1 * 60 * 1000,
      });
    }
  };

  return { prefetchSearch, prefetchSuggestions };
};

// Hook for advanced search with multiple filters
export const useAdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchParams>({});
  
  const updateFilter = (key: keyof SearchParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const removeFilter = (key: keyof SearchParams) => {
    setFilters(prev => {
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  };

  const searchResults = useSearch(filters);

  return {
    filters,
    updateFilter,
    clearFilters,
    removeFilter,
    searchResults,
    hasFilters: Object.keys(filters).length > 0,
  };
};

// Hook for search analytics (client-side tracking)
export const useSearchAnalytics = () => {
  const trackSearch = (query: string, resultCount: number) => {
    // Track search events (could send to analytics service)
    console.log('Search tracked:', { query, resultCount, timestamp: new Date() });
  };

  const trackSearchClick = (query: string, itemId: string, position: number) => {
    // Track click events
    console.log('Search click tracked:', { query, itemId, position, timestamp: new Date() });
  };

  return {
    trackSearch,
    trackSearchClick,
  };
};