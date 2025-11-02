import axios from 'axios';
import type { Availability, AvailabilityRequest, AvailabilityResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const availabilityApi = {
  // Get all availability records
  getAll: async (): Promise<Availability[]> => {
    const response = await api.get<Availability[]>('/availability');
    return response.data;
  },

  // Add or toggle availability
  toggle: async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
    const response = await api.post<AvailabilityResponse>('/availability', data);
    return response.data;
  },

  // Delete a specific availability record
  delete: async (id: number): Promise<void> => {
    await api.delete(`/availability/${id}`);
  },
};

export const usersApi = {
  // Get all unique users
  getAll: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/users');
    return response.data;
  },
};

export default api;
