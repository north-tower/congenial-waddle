import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import type { Retailer } from '../types';
import { comparisonSchema } from '../utils/validators';
import type { ComparisonFormData } from '../utils/validators';
import type { ComparisonRequest } from '../types';
import { RetailerSearch } from '../components/comparison/RetailerSearch';
import { CountrySelector } from '../components/comparison/CountrySelector';
import { ComparisonResults } from '../components/comparison/ComparisonResults';
import { Button } from '../components/common/Button';
import { X } from 'lucide-react';
import { useCompareMutation, useComparisonHistoryItem } from '../hooks/useComparison';
import { useRetailer } from '../hooks/useRetailers';
import { Loading } from '../components/common/Loading';
import { analytics } from '../utils/analytics';
import { useCountries } from '../hooks/useCountries';

export const Comparison: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const historyId = searchParams.get('history');
  const retailerId = searchParams.get('retailer');
  const countryIdParam = searchParams.get('country');
  
  const [selectedRetailers, setSelectedRetailers] = useState<Retailer[]>([]);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  
  const compareMutation = useCompareMutation();
  const { data: historyComparison, isLoading: isLoadingHistory, error: historyError } = useComparisonHistoryItem(
    historyId || '',
    !!historyId
  );
  
  // Fetch retailer if retailerId is in query params
  const { data: retailerFromQuery, isLoading: isLoadingRetailer } = useRetailer(
    retailerId || '',
    !!retailerId && !historyId
  );

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ComparisonFormData>({
    resolver: zodResolver(comparisonSchema),
    defaultValues: {
      retailerIds: [],
      countryId: '',
    },
  });

  // Load history comparison when historyId is present
  useEffect(() => {
    if (historyComparison) {
      setComparisonResult(historyComparison);
    }
  }, [historyComparison]);
  
  // Load retailer and country from query params
  useEffect(() => {
    if (retailerFromQuery) {
      setSelectedRetailers((prev) => {
        // Only add if not already in the list
        if (!prev.find((r) => r.id === retailerFromQuery.id)) {
          const newRetailers = [...prev, retailerFromQuery];
          setValue('retailerIds', newRetailers.map((r) => r.id));
          return newRetailers;
        }
        return prev;
      });
    }
  }, [retailerFromQuery, setValue]);
  
  // Set country from query params
  useEffect(() => {
    if (countryIdParam && !historyId) {
      setValue('countryId', countryIdParam);
    }
  }, [countryIdParam, historyId, setValue]);

  const countryId = watch('countryId');
  const { data: countries } = useCountries();

  // Track comparison start when retailers are selected
  useEffect(() => {
    if (selectedRetailers.length > 0) {
      analytics.trackComparisonStart(selectedRetailers.length);
    }
  }, [selectedRetailers.length]);

  const handleRetailerSelect = (retailer: Retailer) => {
    if (selectedRetailers.length < 10 && !selectedRetailers.find((r) => r.id === retailer.id)) {
      const newRetailers = [...selectedRetailers, retailer];
      setSelectedRetailers(newRetailers);
      setValue('retailerIds', newRetailers.map((r) => r.id));
      analytics.trackRetailerSelect(retailer.id, retailer.name);
    }
  };

  const handleRetailerRemove = (retailerId: string) => {
    const newRetailers = selectedRetailers.filter((r) => r.id !== retailerId);
    setSelectedRetailers(newRetailers);
    setValue('retailerIds', newRetailers.map((r) => r.id));
  };

  const onSubmit = async (data: ComparisonFormData) => {
    try {
      // Transform frontend format to backend format
      const backendRequest: ComparisonRequest = {
        retailers: data.retailerIds,
        country: data.countryId,
      };
      const result = await compareMutation.mutateAsync(backendRequest);
      setComparisonResult(result);
      
      // Track comparison completion
      const countryName = countries?.find(c => c.id === data.countryId)?.name || data.countryId;
      analytics.trackComparisonComplete({
        retailerCount: data.retailerIds.length,
        country: countryName,
        resultCount: result?.totalResults || result?.comparisons?.length || 0,
      });
    } catch (error) {
      console.error('Comparison error:', error);
      if (error instanceof Error) {
        analytics.trackError(error, 'comparison_submit');
      }
    }
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    analytics.trackComparisonExport(format);
    // TODO: Implement export functionality
    console.log('Export comparison results', format);
  };

  const handleNewComparison = () => {
    setComparisonResult(null);
    setSelectedRetailers([]);
    setValue('retailerIds', []);
    setValue('countryId', '');
    setSearchParams({}); // Clear query params
  };

  // Show loading state when fetching history or retailer
  if ((historyId && isLoadingHistory) || (retailerId && isLoadingRetailer)) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <Loading />
        </div>
      </div>
    );
  }

  // Show error state if history fetch failed
  if (historyId && historyError) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 text-center">
            <p className="text-base mb-4">
              Error loading comparison history. Please try again.
            </p>
            <Button variant="outline" onClick={handleNewComparison}>
              Start New Comparison
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {!comparisonResult ? (
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="/" className="hover:text-black transition-colors">Home</a>
              <span>/</span>
              <span className="text-black">Compare Retailers</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-light text-black mb-3 tracking-tight">
              Compare Retailers
            </h1>
            <p className="text-gray-600 text-sm mb-12">
              Select up to 10 retailers and a country to compare shipping costs and delivery times
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Retailer Selection */}
              <div>
                <label className="block text-xs text-black mb-3 uppercase tracking-wider font-medium">
                  Search and Select Retailers (Max 10)
                </label>
                <RetailerSearch
                  onSelect={handleRetailerSelect}
                  selectedRetailerIds={selectedRetailers.map((r) => r.id)}
                  maxSelections={10}
                />
                {errors.retailerIds && (
                  <p className="mt-2 text-xs text-red-600">{errors.retailerIds.message}</p>
                )}
              </div>

              {/* Selected Retailers */}
              {selectedRetailers.length > 0 && (
                <div>
                  <label className="block text-xs text-black mb-3 uppercase tracking-wider font-medium">
                    Selected Retailers ({selectedRetailers.length}/10)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {selectedRetailers.map((retailer) => (
                      <div
                        key={retailer.id}
                        className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-sm"
                      >
                        <span className="text-sm text-black">{retailer.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRetailerRemove(retailer.id)}
                          className="text-gray-600 hover:text-black transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Country Selection */}
              <div>
                <CountrySelector
                  value={countryId}
                  onChange={(value) => {
                    setValue('countryId', value);
                    const countryName = countries?.find(c => c.id === value)?.name || value;
                    analytics.trackCountrySelect(value, countryName);
                  }}
                  error={errors.countryId?.message}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full md:w-auto min-w-[200px]"
                  isLoading={compareMutation.isPending}
                  disabled={selectedRetailers.length === 0 || !countryId}
                >
                  Compare Retailers
                </Button>
              </div>

              {compareMutation.isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                  {compareMutation.error?.message || 'Comparison failed. Please try again.'}
                </div>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="/" className="hover:text-black transition-colors">Home</a>
              <span>/</span>
              <a href="/comparison" className="hover:text-black transition-colors">Compare</a>
              <span>/</span>
              <span className="text-black">Results</span>
            </div>
            <Button variant="outline" onClick={handleNewComparison}>
              New Comparison
            </Button>
          </div>
          <ComparisonResults
            data={comparisonResult}
            isLoading={false}
            onExport={(format) => handleExport(format)}
          />
        </div>
      )}
    </div>
  );
};

