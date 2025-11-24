import apiClient from './client';
import type { Property } from '../types/index';


// Property API endpoints
export const propertyApi = {
  getAll: () => apiClient.get<Property[]>('/properties'),
  getById: (id: number) => apiClient.get<Property>(`/properties/${id}`),
  create: (property: Omit<Property, 'id'>) => apiClient.post<Property>('/properties', property),
  update: (id: number, property: Property) => apiClient.put<Property>(`/properties/${id}`, property),
  delete: (id: number) => apiClient.delete(`/properties/${id}`)
};