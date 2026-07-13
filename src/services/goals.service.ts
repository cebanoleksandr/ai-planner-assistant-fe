import { api } from './';
import type { Goal } from './interfaces';

interface GetGoalsParams {
  lifeAreaId?: string;
  search?: string;
}

export const GoalsService = {
  async getAll(params?: GetGoalsParams) {
    const { data } = await api.get<Goal[]>('/goals', { params });
    return data;
  },

  async create(payload: { title: string; description?: string; targetDate?: string; lifeAreaId?: string }) {
    const { data } = await api.post<Goal>('/goals', payload);
    return data;
  },

  async updateStatus(id: string, status: Goal['status']) {
    const { data } = await api.patch<Goal>(`/goals/${id}/status`, { status });
    return data;
  },

  async delete(id: string) {
    await api.delete(`/goals/${id}`);
  },
};