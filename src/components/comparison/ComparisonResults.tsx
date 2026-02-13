import React, { useState } from 'react';
import type { ComparisonResponse } from '../../types';
import { ResultCard } from './ResultCard';
import { Skeleton, SkeletonCard } from '../common/Skeleton';
import { Button } from '../common/Button';
import { Download, LayoutGrid, Table2 } from 'lucide-react';
import { DataVerificationSection, VerificationBadge } from './VerificationBadge';

interface ComparisonResultsProps {
  data: ComparisonResponse;
  isLoading?: boolean;
  onExport?: (format: 'pdf' | 'excel') => void;
}

export const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  data,
  isLoading,
  onExport,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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

  // Get all unique delivery methods across all retailers for table view
  const getAllMethods = () => {
    const methodMap = new Map<string, { method: string; index: number }>();
    let index = 0;
    
    sortedRetailers.forEach((retailer) => {
      retailer.deliveryMethods.forEach((deliveryMethod) => {
        if (!methodMap.has(deliveryMethod.method)) {
          methodMap.set(deliveryMethod.method, { method: deliveryMethod.method, index: index++ });
        }
      });
    });

    return Array.from(methodMap.values())
      .sort((a, b) => a.index - b.index)
      .map((item) => item.method);
  };

  const allMethods = getAllMethods();

  // Helper to find method for a retailer
  const getMethodForRetailer = (retailerName: string, method: string) => {
    const retailer = sortedRetailers.find((r) => r.retailerName === retailerName);
    return retailer?.deliveryMethods.find((m) => m.method === method);
  };

  // Find cheapest method across all retailers
  const findCheapestMethod = (method: string) => {
    const methodCosts = sortedRetailers
      .map((retailer) => {
        const deliveryMethod = retailer.deliveryMethods.find((m) => m.method === method);
        if (!deliveryMethod) return null;
        const cost = parseCost(deliveryMethod.cost);
        return { retailer: retailer.retailerName, cost, deliveryMethod };
      })
      .filter((item) => item !== null && !isNaN(item.cost))
      .sort((a, b) => (a?.cost || Infinity) - (b?.cost || Infinity));

    return methodCosts[0]?.retailer || null;
  };

  // Calculate verification stats
  const verifiedRetailers = retailersWithData.length;
  const verificationRate = retailersWithData.length > 0 
    ? Math.round((verifiedRetailers / data.totalResults) * 100)
    : 0;

  // Use earliest data timestamp from the results
  const earliestTimestamp = sortedRetailers.reduce((earliest, r) => {
    if (r.dataTimestamp && (!earliest || r.dataTimestamp < earliest)) {
      return r.dataTimestamp;
    }
    return earliest;
  }, sortedRetailers[0]?.dataTimestamp || new Date().toISOString());

  // Helper to safely format a URL for display
  const formatUrlForDisplay = (url: string): string => {
    try {
      const parsed = new URL(url);
      const path = parsed.pathname.length > 30 
        ? parsed.pathname.slice(0, 30) + '…' 
        : parsed.pathname;
      return `${parsed.hostname}${path}`;
    } catch {
      return url;
    }
  };

  // Data Sources section (shared between table and card view)
  const DataSourcesSection = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
        Data Sources
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedRetailers.map((retailer) => (
          <div key={retailer.retailerId} className="flex items-start gap-2 text-xs">
            <span className="font-medium text-gray-800 whitespace-nowrap">
              {retailer.retailerName}:
            </span>
            {retailer.sourceUrl ? (
              <a
                href={retailer.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline truncate"
                title={retailer.sourceUrl}
              >
                {formatUrlForDisplay(retailer.sourceUrl)}
              </a>
            ) : (
              <span className="text-gray-400 italic">No source URL</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
        Data collected on{' '}
        <span className="font-medium">
          {new Date(earliestTimestamp).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
        {' at '}
        <span className="font-medium">
          {new Date(earliestTimestamp).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
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
          <div className="flex gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-gray-300 rounded-sm p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-sm transition-colors ${
                  viewMode === 'table'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Table view"
                title="Table view"
              >
                <Table2 size={18} />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-sm transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Card view"
                title="Card view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            {onExport && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => onExport('pdf')} 
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Export PDF
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onExport('excel')} 
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Export Excel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Data Verification Section */}
      <DataVerificationSection
        verificationRate={verificationRate}
        totalRetailers={data.totalResults}
        verifiedRetailers={verifiedRetailers}
        lastUpdated={earliestTimestamp}
      />

      {/* Results Section */}
      {sortedRetailers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-black tracking-tight">
              Results {viewMode === 'table' ? '(Table View)' : '(Sorted by Lowest Cost)'}
            </h2>
            <span className="text-sm text-gray-600">
              {sortedRetailers.length} {sortedRetailers.length === 1 ? 'result' : 'results'}
            </span>
          </div>

          {viewMode === 'table' ? (
            /* Table View */
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-b border-gray-200">
                        Delivery Method
                      </th>
                      {sortedRetailers.map((retailer) => (
                        <th
                          key={retailer.retailerId}
                          className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200 min-w-[200px]"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span>{retailer.retailerName}</span>
                            <VerificationBadge
                              verificationStatus="verified"
                              sourceUrl={retailer.sourceUrl}
                              showDetails={false}
                            />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allMethods.length > 0 ? (
                      allMethods.map((method) => {
                        const cheapestRetailer = findCheapestMethod(method);
                        return (
                          <tr key={method} className="hover:bg-gray-50">
                            <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm font-medium text-black border-r border-gray-200 whitespace-nowrap">
                              {method}
                            </td>
                            {sortedRetailers.map((retailer) => {
                              const deliveryMethod = getMethodForRetailer(retailer.retailerName, method);
                              const isCheapest = cheapestRetailer === retailer.retailerName;
                              
                              return (
                                <td
                                  key={`${retailer.retailerId}-${method}`}
                                  className={`px-6 py-4 text-sm text-center border-gray-200 ${
                                    isCheapest ? 'bg-green-50' : ''
                                  }`}
                                >
                                  {deliveryMethod ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-center gap-2">
                                        <span className="text-base font-semibold text-black">
                                          {deliveryMethod.cost}
                                        </span>
                                        {isCheapest && (
                                          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                                            Best
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {deliveryMethod.duration}
                                      </div>
                                      {deliveryMethod.carrier && (
                                        <div className="text-xs text-gray-500">
                                          via {deliveryMethod.carrier}
                                        </div>
                                      )}
                                      {deliveryMethod.freeShippingThreshold && (
                                        <div className="text-xs text-green-700">
                                          Free over {deliveryMethod.freeShippingThreshold}
                                        </div>
                                      )}
                                      {(deliveryMethod.notes || deliveryMethod.additionalNotes) && (
                                        <div className="text-xs text-gray-500 mt-1 italic max-w-xs mx-auto">
                                          {deliveryMethod.notes || deliveryMethod.additionalNotes}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-sm">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={sortedRetailers.length + 1} className="px-6 py-8 text-center text-gray-500">
                          No delivery methods available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Source URLs & Timestamp below table */}
              <div className="mt-6">
                <DataSourcesSection />
              </div>
            </div>
          ) : (
            /* Card View */
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedRetailers.map((comparison) => (
                  <ResultCard
                    key={comparison.retailerId}
                    retailerName={comparison.retailerName}
                    deliveryMethods={comparison.deliveryMethods}
                    hasData={comparison.hasData}
                    sourceUrl={comparison.sourceUrl}
                    dataTimestamp={comparison.dataTimestamp}
                  />
                ))}
              </div>

              {/* Source URLs & Timestamp below cards */}
              <DataSourcesSection />
            </div>
          )}
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
