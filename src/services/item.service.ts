import instance from "@/lib/axios";

// Types
type CreateItemData = {
    title: string;
    price: number;
    categoryId?: string;
    image: File;
}

type UpdateItemData = {
    title?: string;
    price?: number;
    categoryId?: string;
}

type SearchParams = {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sortBy?: 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

class ItemService {
    // User Item Management (Authenticated Routes)
    async createItem(data: CreateItemData) {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('price', data.price.toString());
        if (data.categoryId) {
            formData.append('categoryId', data.categoryId);
        }
        formData.append('image', data.image);

        const response = await instance.post('/users/items', formData, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return response.data;
    }

    async getMyItems() {
        const response = await instance.get('/users/items');
        return response.data;
    }

    async updateMyItem(itemId: string, data: UpdateItemData) {
        const response = await instance.patch(`/users/items/${itemId}`, data);
        return response.data;
    }

    async markItemAsSold(itemId: string) {
        const response = await instance.patch(`/users/items/${itemId}/sold`);
        return response.data;
    }

    async deleteMyItem(itemId: string) {
        const response = await instance.delete(`/users/items/${itemId}`);
        return response.data;
    }

    // Public Item Access (No Authentication Required)
    async searchItems(params: SearchParams = {}) {
        const searchParams = new URLSearchParams();
        
        if (params.q) searchParams.append('q', params.q);
        if (params.category) searchParams.append('category', params.category);
        if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        try {
            // Try the public route first
            const response = await instance.get(`/public/items/search?${searchParams.toString()}`);
            return response.data;
        } catch (error) {
            // If public route fails, fall back to admin route (for development)
            console.warn('Public item search route failed, trying admin route');
            const response = await instance.get(`/admins/item?${searchParams.toString()}`);
            return response.data;
        }
    }

    async getItemById(itemId: string) {
        try {
            // Try the public route first
            const response = await instance.get(`/public/items/${itemId}`);
            return response.data;
        } catch (error) {
            // If public route fails, fall back to admin route (for development)
            console.warn('Public item route failed, trying admin route');
            const response = await instance.get(`/admins/item/${itemId}`);
            return response.data;
        }
    }
}

export const itemService = new ItemService();