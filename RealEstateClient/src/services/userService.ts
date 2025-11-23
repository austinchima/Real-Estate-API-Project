import { userApi } from '../api';
import { User } from '../types';

// Service layer for user business logic
export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await userApi.getAll();
    return response.data;
  },

  async getUser(id: number): Promise<User> {
    const response = await userApi.getById(id);
    return response.data;
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await userApi.create(user);
    return response.data;
  },

  async updateUser(id: number, user: User): Promise<User> {
    const response = await userApi.update(id, user);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await userApi.delete(id);
  }
};