import React from 'react';
import type { ComparisonResponse } from '../../types';
import { ResultCard } from './ResultCard';
import { Skeleton, SkeletonCard } from '../common/Skeleton';
import { Button } from '../common/Button';
import { Download } from 'lucide-react';

interface ComparisonResultsProps {
  data: ComparisonResponse;
  isLoading?: boolean;
  onExport?: () => void;
}

export const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  data,
  isLoading,
  onExport,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-12">
        {/* Header Skeleton */}
        <div className="border-b border-gray-200 pb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton height={48} width={300} className="mb-3" />
              <Skeleton height={20} width={250} className="mb-2" />
              <Skeleton height={20} width={200} />
            </div>
            <Skeleton height={40} width={150} className="rounded-sm" />
          </div>
        </div>

        {/* Results Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton height={32} width={250} />
            <Skeleton height={20} width={100} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Separate retailers with and without data
  const retailersWithData = data.comparisons.filter((comp) => comp.hasData);
  const retailersWithoutData = data.comparisons.filter((comp) => !comp.hasData);

  // Helper to parse cost string to number
  const parseCost = (cost: string): number => {
    const num = parseFloat(cost.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Sort retailers with data by lowest cost
  const sortedRetailers = retailersWithData.sort((a, b) => {
    const costsA = a.deliveryMethods.map((m) => parseCost(m.cost));
    const costsB = b.deliveryMethods.map((m) => parseCost(m.cost));
    const minCostA = costsA.length > 0 ? Math.min(...costsA) : Infinity;
    const minCostB = costsB.length > 0 ? Math.min(...costsB) : Infinity;
    return minCostA - minCostB;
  });

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-light text-black mb-3 tracking-tight">
              Comparison Results
            </h1>
            <p className="text-gray-600 text-sm mb-2">
              Shipping comparison for <span className="font-medium">{data.country.name}</span>
            </p>
            <p className="text-gray-600 text-sm">
              {data.totalResults} retailer{data.totalResults !== 1 ? 's' : ''} compared
            </p>
          </div>
          {onExport && (
            <Button variant="outline" onClick={onExport} className="flex items-center gap-2">
              <Download size={16} />
              Export Results
            </Button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {sortedRetailers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-black tracking-tight">
              Results (Sorted by Lowest Cost)
            </h2>
            <span className="text-sm text-gray-600">
              {sortedRetailers.length} {sortedRetailers.length === 1 ? 'result' : 'results'}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedRetailers.map((comparison) => (
              <ResultCard
                key={comparison.retailerId}
                retailerName={comparison.retailerName}
                deliveryMethods={comparison.deliveryMethods}
                hasData={comparison.hasData}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Data Section */}
      {retailersWithoutData.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-black tracking-tight">
            No Data Available
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retailersWithoutData.map((comparison) => (
              <ResultCard
                key={comparison.retailerId}
                retailerName={comparison.retailerName}
                deliveryMethods={[]}
                hasData={false}
              />
            ))}
          </div>
        </div>
      )}

      {data.comparisons.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">No comparison data available</p>
          <p className="text-gray-400 text-sm">Try selecting different retailers or countries</p>
        </div>
      )}
    </div>
  );
};

