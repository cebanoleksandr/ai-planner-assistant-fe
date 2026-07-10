import { api } from ".";
import type { User } from "./interfaces";

export const UsersService = {
  async getMe() {
    const { data } = await api.get<User>('/users/me');
    return data;
  },
};