import api from './axios';
import type {
  ComparisonRequest,
  ComparisonResponse,
  ComparisonHistory,
  BackendComparisonResponse,
  BackendComparisonHistoryItem,
  RetailerComparison,
} from '../types';

// Transform backend response to frontend format
const transformComparisonResponse = (backendResponse: BackendComparisonResponse): ComparisonResponse => {
  const { comparison } = backendResponse;
  
  // Get country info from first result (all results have same country)
  const country = comparison.results.length > 0 
    ? comparison.results[0].country 
    : { id: '', name: comparison.country, code: '' };

  // Transform results to RetailerComparison format
  const comparisons: RetailerComparison[] = comparison.results.map((result) => ({
    retailerId: result.retailer.id,
    retailerName: result.retailer.name,
    deliveryMethods: result.methods.map((method) => ({
      method: method.method,
      cost: method.cost,
      duration: method.duration,
      notes: method.additionalNotes,
    })),
    hasData: result.methods.length > 0,
  }));

  // Note: Retailers without data would need to be fetched separately
  // For now, we only show retailers that have comparison results

  return {
    country,
    comparisons,
    totalResults: comparisons.length,
  };
};

// Transform history item
const transformHistoryItem = (item: BackendComparisonHistoryItem): ComparisonHistory => {
  // Note: Backend returns retailer IDs, we'd need to fetch names
  // For now, use IDs as placeholder
  return {
    id: item.id,
    countryName: item.country,
    retailerNames: item.retailers, // This should be names, but backend returns IDs
    createdAt: item.createdAt,
  };
};

export const comparisonApi = {
  compare: async (request: ComparisonRequest): Promise<ComparisonResponse> => {
    const response = await api.post<BackendComparisonResponse>('/compare', request);
    return transformComparisonResponse(response.data);
  },

  getHistory: async (): Promise<ComparisonHistory[]> => {
    const response = await api.get<{ comparisons: BackendComparisonHistoryItem[] }>('/compare/history');
    return response.data.comparisons.map(transformHistoryItem);
  },

  getHistoryById: async (id: string): Promise<ComparisonResponse> => {
    const response = await api.get<{ comparison: BackendComparisonHistoryItem }>(`/compare/${id}`);
    // Transform the history item to comparison response format
    const backendResponse: BackendComparisonResponse = {
      comparison: response.data.comparison,
    };
    return transformComparisonResponse(backendResponse);
  },
};

