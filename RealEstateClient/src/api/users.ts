import apiClient from './client';
import type { User } from '../types';

// User API endpoints
export const userApi = {
  getAll: () => apiClient.get<User[]>('/users'),
  getById: (id: number) => apiClient.get<User>(`/users/${id}`),
  create: (user: Omit<User, 'id'>) => apiClient.post<User>('/users', user),
  update: (id: number, user: User) => apiClient.put<User>(`/users/${id}`, user),
  delete: (id: number) => apiClient.delete(`/users/${id}`)
};