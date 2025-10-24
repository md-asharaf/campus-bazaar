import instance from "@/lib/axios";

// Types
type AddToWishlistData = {
    itemId: string;
}

class WishlistService {
    // Get user's wishlist
    async getWishlist() {
        const response = await instance.get('/users/wishlist');
        return response.data;
    }

    // Add item to wishlist
    async addToWishlist(data: AddToWishlistData) {
        const response = await instance.post('/users/wishlist', data);
        return response.data;
    }

    // Remove item from wishlist
    async removeFromWishlist(itemId: string) {
        const response = await instance.delete(`/users/wishlist/${itemId}`);
        return response.data;
    }

    // Check if item is in wishlist
    async checkWishlistStatus(itemId: string) {
        const response = await instance.get(`/users/wishlist/${itemId}/status`);
        return response.data;
    }
}

export const wishlistService = new WishlistService();