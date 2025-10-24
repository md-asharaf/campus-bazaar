import instance from "@/lib/axios";

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
}

type SuggestionParams = {
    q: string;
    limit?: number;
}

class SearchService {
    // General search functionality
    async search(params: SearchParams = {}) {
        const searchParams = new URLSearchParams();
        
        if (params.q) searchParams.append('q', params.q);
        if (params.category) searchParams.append('category', params.category);
        if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        const response = await instance.get(`/public/search?${searchParams.toString()}`);
        return response.data;
    }

    // Get search suggestions/autocomplete
    async getSuggestions(params: SuggestionParams) {
        const searchParams = new URLSearchParams();
        searchParams.append('q', params.q);
        if (params.limit) searchParams.append('limit', params.limit.toString());

        const response = await instance.get(`/public/search/suggestions?${searchParams.toString()}`);
        return response.data;
    }
}

export const searchService = new SearchService();