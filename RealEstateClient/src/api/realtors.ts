import apiClient from './client';
import type { Realtor } from '../types';

// Realtor API endpoints
export const realtorApi = {
  getAll: () => apiClient.get<Realtor[]>('/realtors'),
  getById: (id: number) => apiClient.get<Realtor>(`/realtors/${id}`),
  create: (realtor: Omit<Realtor, 'id'>) => apiClient.post<Realtor>('/realtors', realtor),
  update: (id: number, realtor: Realtor) => apiClient.put<Realtor>(`/realtors/${id}`, realtor),
  delete: (id: number) => apiClient.delete(`/realtors/${id}`)
};