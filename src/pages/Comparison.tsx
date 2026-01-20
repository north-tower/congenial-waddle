import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import { comparisonSchema } from '../utils/validators';
import type { ComparisonFormData } from '../utils/validators';
import type { ComparisonRequest } from '../types';
import { RetailerInput } from '../components/comparison/RetailerInput';
import { CountrySelector } from '../components/comparison/CountrySelector';
import { ComparisonResults } from '../components/comparison/ComparisonResults';
import { Button } from '../components/common/Button';
import { CurrencySelector } from '../components/common/CurrencySelector';
import { useCurrency } from '../context/CurrencyContext';
import { useCompareMutation, useComparisonHistoryItem } from '../hooks/useComparison';
import { Loading } from '../components/common/Loading';
import { analytics } from '../utils/analytics';
import { useCountries } from '../hooks/useCountries';

export const Comparison: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const historyId = searchParams.get('history');
  const countryIdParam = searchParams.get('country');
  
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  
  const compareMutation = useCompareMutation();
  const { data: historyComparison, isLoading: isLoadingHistory, error: historyError } = useComparisonHistoryItem(
    historyId || '',
    !!historyId
  );

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ComparisonFormData>({
    resolver: zodResolver(comparisonSchema),
    defaultValues: {
      retailerNames: [],
      countryId: '',
    },
  });

  // Load history comparison when historyId is present
  useEffect(() => {
    if (historyComparison) {
      setComparisonResult(historyComparison);
    }
  }, [historyComparison]);
  
  // Set country from query params
  useEffect(() => {
    if (countryIdParam && !historyId) {
      setValue('countryId', countryIdParam);
    }
  }, [countryIdParam, historyId, setValue]);

  const countryId = watch('countryId');
  const { data: countries } = useCountries();
  const { currency } = useCurrency();

  // Track comparison start when retailers are selected
  useEffect(() => {
    if (selectedRetailers.length > 0) {
      analytics.trackComparisonStart(selectedRetailers.length);
    }
  }, [selectedRetailers.length]);

  const handleRetailerAdd = (retailerName: string) => {
    if (selectedRetailers.length < 10) {
      const newRetailers = [...selectedRetailers, retailerName];
      setSelectedRetailers(newRetailers);
      setValue('retailerNames', newRetailers);
      analytics.trackRetailerSelect(retailerName, retailerName);
    }
  };

  const handleRetailerRemove = (retailerName: string) => {
    const newRetailers = selectedRetailers.filter((r) => r !== retailerName);
    setSelectedRetailers(newRetailers);
    setValue('retailerNames', newRetailers);
  };

  const onSubmit = async (data: ComparisonFormData) => {
    try {
      // Get country name from ID or use the ID directly
      const countryName = countries?.find(c => c.id === data.countryId)?.name || data.countryId;
      
      // Transform frontend format to backend format - now sending retailer names
      const backendRequest: ComparisonRequest = {
        retailers: data.retailerNames, // Now sending names instead of IDs
        country: countryName, // Send country name instead of ID
        currency: currency, // Include selected currency
      };
      const result = await compareMutation.mutateAsync(backendRequest);
      setComparisonResult(result);
      
      // Track comparison completion
      analytics.trackComparisonComplete({
        retailerCount: data.retailerNames.length,
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
    setValue('retailerNames', []);
    setValue('countryId', '');
    setSearchParams({}); // Clear query params
  };

  // Show loading state when fetching history
  if (historyId && isLoadingHistory) {
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
              Enter up to 10 retailer names and select a country. Our AI agent will fetch the latest shipping costs and delivery times.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Retailer Input */}
              <div>
                <label className="block text-xs text-black mb-3 uppercase tracking-wider font-medium">
                  Enter Retailer Names (Max 10)
                </label>
                <RetailerInput
                  selectedRetailers={selectedRetailers}
                  onAdd={handleRetailerAdd}
                  onRemove={handleRetailerRemove}
                  maxSelections={10}
                  error={errors.retailerNames?.message}
                />
              </div>

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

              {/* Currency Selection */}
              <div>
                <CurrencySelector />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full md:w-auto min-w-[200px]"
                  isLoading={compareMutation.isPending}
                  disabled={selectedRetailers.length === 0 || !countryId || compareMutation.isPending}
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

