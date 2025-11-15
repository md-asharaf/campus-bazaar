import instance from "@/lib/axios-user";

// Types
type CreateFeedbackData = {
    content: string;
    rating: number;
}

type UpdateFeedbackData = {
    content?: string;
    rating?: number;
}

class FeedbackService {
    // Create new feedback
    async createFeedback(data: CreateFeedbackData) {
        const response = await instance.post('/users/feedback', data);
        return response.data;
    }

    // Get user's feedback
    async getMyFeedback() {
        const response = await instance.get('/users/feedback');
        return response.data;
    }

    // Update user's feedback
    async updateMyFeedback(data: UpdateFeedbackData) {
        const response = await instance.patch('/users/feedback', data);
        return response.data;
    }

    // Delete user's feedback
    async deleteMyFeedback() {
        const response = await instance.delete('/users/feedback');
        return response.data;
    }
}

export const feedbackService = new FeedbackService();