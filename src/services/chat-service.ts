
import type { SendImageMessageResponse } from '@/types';
import axios from 'axios';



interface SendImageMessageProps {
    imageFile: File;
    content: string;
    chatId: string
}




class ChatService {

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    async sendImageMessage({ imageFile, content, chatId }: SendImageMessageProps): Promise<SendImageMessageResponse> {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('content', content);

        const user = this.getCurrentUser();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/chat/${chatId}/images`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            return response.data

        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to send image message');
            }
            throw new Error('Failed to send image message');
        }
    }
}

export default new ChatService();