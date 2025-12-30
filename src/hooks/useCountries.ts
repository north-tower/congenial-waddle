import { useQuery } from '@tanstack/react-query';
import { countriesApi } from '../api/countries';
import type { Country } from '../types';

export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: () => countriesApi.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes - countries don't change often
  });
};

export const useCountry = (id: string, enabled: boolean = true) => {
  return useQuery<Country>({
    queryKey: ['countries', id],
    queryFn: () => countriesApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000,
  });
};

