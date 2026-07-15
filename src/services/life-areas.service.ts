import { api } from './';
import type { LifeArea } from './interfaces';

export const LifeAreasService = {
  async getAll() {
    const { data } = await api.get<LifeArea[]>('/life-areas');
    return data;
  },

  async create(payload: { name: string; color?: string }) {
    const { data } = await api.post<LifeArea>('/life-areas', payload);
    return data;
  },

  async update(id: string, payload: { name?: string; color?: string }) {
    const { data } = await api.patch<LifeArea>(`/life-areas/${id}`, payload);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/life-areas/${id}`);
  },
};