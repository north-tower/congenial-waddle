import api from './axios';
import type { Retailer, RetailerSearchResponse } from '../types';

export const retailersApi = {
  search: async (query: string): Promise<Retailer[]> => {
    const response = await api.get<RetailerSearchResponse>('/retailers', {
      params: { search: query },
    });
    return response.data.retailers;
  },

  getAll: async (): Promise<Retailer[]> => {
    const response = await api.get<{ retailers: Retailer[] }>('/retailers');
    return response.data.retailers;
  },

  getById: async (id: string): Promise<Retailer> => {
    const response = await api.get<{ retailer: Retailer }>(`/retailers/${id}`);
    return response.data.retailer;
  },
};

