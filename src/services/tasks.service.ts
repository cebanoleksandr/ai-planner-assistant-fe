import { api } from './';
import type { Task } from './interfaces';

interface GetTasksParams {
  startDate?: string;
  endDate?: string;
  search?: string;
}

export const TasksService = {
  async getAll(params?: GetTasksParams) {
    const { data } = await api.get<Task[]>('/tasks', { params });
    return data;
  },

  async create(payload: { title: string; description?: string; dueDate?: string; goalId?: string }) {
    const { data } = await api.post<Task>('/tasks', payload);
    return data;
  },

  async toggleComplete(id: string) {
    const { data } = await api.patch<Task>(`/tasks/${id}/toggle`);
    return data;
  },
};
