import { realtorApi } from '../api';
import { Realtor } from '../types';

// Service layer for realtor business logic
export const realtorService = {
  async getAllRealtors(): Promise<Realtor[]> {
    const response = await realtorApi.getAll();
    return response.data;
  },

  async getRealtor(id: number): Promise<Realtor> {
    const response = await realtorApi.getById(id);
    return response.data;
  },

  async createRealtor(realtor: Omit<Realtor, 'id'>): Promise<Realtor> {
    const response = await realtorApi.create(realtor);
    return response.data;
  },

  async updateRealtor(id: number, realtor: Realtor): Promise<Realtor> {
    const response = await realtorApi.update(id, realtor);
    return response.data;
  },

  async deleteRealtor(id: number): Promise<void> {
    await realtorApi.delete(id);
  }
};