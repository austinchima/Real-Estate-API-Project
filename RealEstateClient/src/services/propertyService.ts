import { propertyApi } from '../api';
import type { Property } from '../types';

// Service layer for property business logic
export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    const response = await propertyApi.getAll();
    return response.data;
  },

  async getProperty(id: number): Promise<Property> {
    const response = await propertyApi.getById(id);
    return response.data;
  },

  async createProperty(property: Omit<Property, 'id'>): Promise<Property> {
    const response = await propertyApi.create(property);
    return response.data;
  },

  async updateProperty(id: number, property: Property): Promise<Property> {
    const response = await propertyApi.update(id, property);
    return response.data;
  },

  async deleteProperty(id: number): Promise<void> {
    await propertyApi.delete(id);
  }
};