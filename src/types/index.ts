// User Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: string; // free, starter, professional, enterprise
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Retailer Types
export interface Retailer {
  id: string;
  name: string;
  website?: string;
}

export interface RetailerSearchResponse {
  retailers: Retailer[];
}

// Country Types
export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface CountryListResponse {
  countries: Country[];
}

// Comparison Types
export interface DeliveryMethod {
  method: string;
  cost: string; // Backend returns as string
  duration: string;
  notes?: string; // Maps from backend's additionalNotes
  freeShippingThreshold?: string;
  carrier?: string;
  additionalNotes?: string; // Original backend field
}

export interface ComparisonResult {
  retailer: {
    id: string;
    name: string;
  };
  country: {
    id: string;
    name: string;
    code: string;
  };
  methods: DeliveryMethod[];
  cheapestOption?: {
    method: string;
    cost: string;
    duration: string;
  };
}

// Backend comparison response format
export interface BackendComparisonResponse {
  comparison: {
    id: string;
    retailers: string[]; // Array of retailer IDs
    country: string; // Country name
    results: ComparisonResult[];
    createdAt: string;
  };
}

// Frontend-friendly comparison response
export interface ComparisonResponse {
  country: {
    id: string;
    name: string;
    code: string;
  };
  comparisons: RetailerComparison[];
  totalResults: number;
}

export interface RetailerComparison {
  retailerId: string;
  retailerName: string;
  deliveryMethods: DeliveryMethod[];
  hasData: boolean;
}

// Backend request format
export interface ComparisonRequest {
  retailers: string[];
  country: string;
}

// Backend history response format
export interface BackendComparisonHistoryItem {
  id: string;
  retailers: string[];
  country: string;
  results: ComparisonResult[];
  createdAt: string;
}

export interface ComparisonHistory {
  id: string;
  countryName: string;
  retailerNames: string[];
  createdAt: string;
}

// API Response Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}


