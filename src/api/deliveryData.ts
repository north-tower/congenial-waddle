import api from './axios';

export interface DeliveryData {
  id: string;
  retailerId: string;
  countryId: string;
  method: string;
  cost: string;
  duration: string;
  freeShippingThreshold?: string;
  carrier?: string;
  additionalNotes?: string;
  retailer?: {
    id: string;
    name: string;
  };
  country?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface DeliveryDataResponse {
  deliveryData: DeliveryData[];
}

export interface DeliveryDataFilters {
  retailerId?: string;
  countryId?: string;
  method?: string;
}

export const deliveryDataApi = {
  getAll: async (filters?: DeliveryDataFilters): Promise<DeliveryData[]> => {
    const params = new URLSearchParams();
    if (filters?.retailerId) params.append('retailerId', filters.retailerId);
    if (filters?.countryId) params.append('countryId', filters.countryId);
    if (filters?.method) params.append('method', filters.method);
    
    const response = await api.get<DeliveryDataResponse>(
      `/delivery-data${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data.deliveryData;
  },

  getById: async (id: string): Promise<DeliveryData> => {
    const response = await api.get<{ deliveryData: DeliveryData }>(`/delivery-data/${id}`);
    return response.data.deliveryData;
  },
};

