import instance from "@/lib/axios";

// Types
type CreateCategoryData = {
    name: string;
    image?: File;
}

type UpdateCategoryData = {
    name?: string;
    image?: File;
}

type UpdateUserData = {
    name?: string;
    email?: string;
    bio?: string;
    phone?: string;
    branch?: string;
    year?: number;
    isActive?: boolean;
    isVerified?: boolean;
}

type UpdateItemData = {
    title?: string;
    price?: number;
    categoryId?: string;
    isVerified?: boolean;
    isSold?: boolean;
}

type UpdateVerificationData = {
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

type GetUsersParams = {
    page?: number;
    limit?: number;
    search?: string;
    isVerified?: boolean;
    isActive?: boolean;
}

type GetItemsParams = {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isVerified?: boolean;
    isSold?: boolean;
}

type GetFeedbackParams = {
    page?: number;
    limit?: number;
    rating?: number;
}

type GetVerificationsParams = {
    page?: number;
    limit?: number;
    status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

class AdminService {
    // User Management
    async getAllUsers(params: GetUsersParams = {}) {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.isVerified !== undefined) searchParams.append('isVerified', params.isVerified.toString());
        if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());

        const response = await instance.get(`/admins/user?${searchParams.toString()}`);
        return response.data;
    }
    async getMe() {
        const response = await instance.get(`/admins/me`);
        return response.data;
    }
    async getUserById(userId: string) {
        const response = await instance.get(`/admins/user/${userId}`);
        return response.data;
    }

    async updateUser(userId: string, data: UpdateUserData) {
        const response = await instance.patch(`/admins/user/${userId}`, data);
        return response.data;
    }

    async toggleUserStatus(userId: string) {
        const response = await instance.patch(`/admins/user/${userId}/toggle-status`);
        return response.data;
    }

    async deleteUser(userId: string) {
        const response = await instance.delete(`/admins/user/${userId}`);
        return response.data;
    }

    // Verification Management
    async getAllVerifications(params: GetVerificationsParams = {}) {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.status) searchParams.append('status', params.status);

        const response = await instance.get(`/admins/verification?${searchParams.toString()}`);
        return response.data;
    }

    async getVerification(userId: string) {
        const response = await instance.get(`/admins/verification/${userId}`);
        return response.data;
    }

    async updateVerification(id: string, data: UpdateVerificationData) {
        const response = await instance.patch(`/admins/verification/${id}`, data);
        return response.data;
    }

    // Item Management
    async getAllItems(params: GetItemsParams = {}) {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.categoryId) searchParams.append('categoryId', params.categoryId);
        if (params.isVerified !== undefined) searchParams.append('isVerified', params.isVerified.toString());
        if (params.isSold !== undefined) searchParams.append('isSold', params.isSold.toString());

        const response = await instance.get(`/admins/item?${searchParams.toString()}`);
        return response.data;
    }

    async getItemById(itemId: string) {
        const response = await instance.get(`/admins/item/${itemId}`);
        return response.data;
    }

    async updateItem(itemId: string, data: UpdateItemData) {
        const response = await instance.patch(`/admins/item/${itemId}`, data);
        return response.data;
    }

    async verifyItem(itemId: string) {
        const response = await instance.patch(`/admins/item/${itemId}/verify`);
        return response.data;
    }

    async rejectItem(itemId: string) {
        const response = await instance.patch(`/admins/item/${itemId}/reject`);
        return response.data;
    }

    async deleteItem(itemId: string) {
        const response = await instance.delete(`/admins/item/${itemId}`);
        return response.data;
    }

    // Category Management
    async createCategory(data: CreateCategoryData) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await instance.post('/admins/category', formData, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return response.data;
    }

    async getAllCategories() {
        const response = await instance.get('/admins/category');
        return response.data;
    }

    async getCategoryById(categoryId: string) {
        const response = await instance.get(`/admins/category/${categoryId}`);
        return response.data;
    }

    async updateCategory(categoryId: string, data: UpdateCategoryData) {
        const formData = new FormData();
        if (data.name) {
            formData.append('name', data.name);
        }
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await instance.patch(`/admins/category/${categoryId}`, formData, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return response.data;
    }

    async deleteCategory(categoryId: string) {
        const response = await instance.delete(`/admins/category/${categoryId}`);
        return response.data;
    }

    // Feedback Management
    async getAllFeedback(params: GetFeedbackParams = {}) {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.rating !== undefined) searchParams.append('rating', params.rating.toString());

        const response = await instance.get(`/admins/feedback?${searchParams.toString()}`);
        return response.data;
    }

    async getFeedbackById(feedbackId: string) {
        const response = await instance.get(`/admins/feedback/${feedbackId}`);
        return response.data;
    }

    async deleteFeedback(feedbackId: string) {
        const response = await instance.delete(`/admins/feedback/${feedbackId}`);
        return response.data;
    }

    // Dashboard Stats
    async getDashboardStats() {
        const response = await instance.get('/admins/dashboard/stats');
        return response.data;
    }
}

export const adminService = new AdminService();