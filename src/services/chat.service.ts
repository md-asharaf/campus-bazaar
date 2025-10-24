import axios from '@/lib/axios';

class ChatService {
  async getMyChats(page = 1, limit = 10) {
    const { data } = await axios.get(`/users/chats?page=${page}&limit=${limit}`);
    return data;
  }

  async createOrGetChat(userId: string) {
    const { data } = await axios.post('/users/chats', { userId });
    return data;
  }

  async getMessages(chatId: string, page = 1, limit = 10) {
    const { data } = await axios.get(`/users/chats/${chatId}/messages?page=${page}&limit=${limit}`);
    return data;
  }

  async sendImageMessage(chatId: string, content: string, images: File[]) {
    const formData = new FormData();
    formData.append('content', content);
    images.forEach(image => {
      formData.append('images', image);
    });
    const { data } = await axios.post(`/users/chats/${chatId}/images`, formData, {
      headers: {
        'Content-Type': "multipart/form-data",
      },
    });
    return data;
  }
}

export const chatService = new ChatService();