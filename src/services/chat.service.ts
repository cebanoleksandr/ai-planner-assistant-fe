import { api } from './';

export const ChatService = {
  async sendMessage(message: string) {
    const { data } = await api.post('/chat', { message });
    return data;
  },
};
