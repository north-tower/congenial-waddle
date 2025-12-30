import { useQuery } from '@tanstack/react-query';
import { retailersApi } from '../api/retailers';
import type { Retailer } from '../types';

export const useRetailerSearch = (query: string, enabled: boolean = true) => {
  return useQuery<Retailer[]>({
    queryKey: ['retailers', 'search', query],
    queryFn: () => retailersApi.search(query),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRetailers = () => {
  return useQuery<Retailer[]>({
    queryKey: ['retailers'],
    queryFn: () => retailersApi.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRetailer = (id: string, enabled: boolean = true) => {
  return useQuery<Retailer>({
    queryKey: ['retailers', id],
    queryFn: () => retailersApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000,
  });
};

