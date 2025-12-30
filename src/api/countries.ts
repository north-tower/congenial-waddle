import api from './axios';
import type { Country, CountryListResponse } from '../types';

export const countriesApi = {
  getAll: async (): Promise<Country[]> => {
    const response = await api.get<CountryListResponse>('/countries');
    return response.data.countries;
  },

  getById: async (id: string): Promise<Country> => {
    const response = await api.get<{ country: Country }>(`/countries/${id}`);
    return response.data.country;
  },
};

