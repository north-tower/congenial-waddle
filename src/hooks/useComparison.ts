import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comparisonApi } from '../api/comparison';
import type { ComparisonRequest, ComparisonResponse, ComparisonHistory } from '../types';

export const useComparison = (request: ComparisonRequest | null, enabled: boolean = false) => {
  return useQuery<ComparisonResponse>({
    queryKey: ['comparison', request],
    queryFn: () => comparisonApi.compare(request!),
    enabled: enabled && !!request && request.retailers.length > 0 && !!request.country,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCompareMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ComparisonResponse, Error, ComparisonRequest>({
    mutationFn: (request) => comparisonApi.compare(request),
    onSuccess: (data, variables) => {
      // Invalidate history to refresh the list
      queryClient.invalidateQueries({ queryKey: ['comparison', 'history'] });
      // Cache the comparison result
      queryClient.setQueryData(['comparison', variables], data);
    },
  });
};

export const useComparisonHistory = () => {
  return useQuery<ComparisonHistory[]>({
    queryKey: ['comparison', 'history'],
    queryFn: () => comparisonApi.getHistory(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useComparisonHistoryItem = (id: string, enabled: boolean = true) => {
  return useQuery<ComparisonResponse>({
    queryKey: ['comparison', 'history', id],
    queryFn: () => comparisonApi.getHistoryById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

