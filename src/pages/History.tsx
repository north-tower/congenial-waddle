import React from 'react';
import { Link } from 'react-router-dom';
import { useComparisonHistory } from '../hooks/useComparison';
import { Skeleton, SkeletonCard } from '../components/common/Skeleton';
import { formatDate } from '../utils/formatters';
import { ArrowRight, Globe, Calendar } from 'lucide-react';

export const History: React.FC = () => {
  const { data: history, isLoading, error } = useComparisonHistory();

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* Header Skeleton */}
          <div className="mb-12">
            <Skeleton height={48} width={300} className="mb-3" />
            <Skeleton height={20} width={250} />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 text-center">
            <p className="text-base">
              Error loading history. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-black mb-3 tracking-tight">Comparison History</h1>
          <p className="text-gray-600 text-sm">View your previous comparison results</p>
        </div>

        {history && history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <Link
                key={item.id}
                to={`/comparison?history=${item.id}`}
                className="group bg-white border border-gray-200 hover:border-black transition-colors p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <Globe size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-light text-black tracking-tight">
                        {item.countryName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.retailerNames.length} {item.retailerNames.length === 1 ? 'retailer' : 'retailers'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.retailerNames.slice(0, 3).join(', ')}
                    {item.retailerNames.length > 3 && ` +${item.retailerNames.length - 3} more`}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={14} />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black group-hover:gap-4 transition-all">
                    <span className="uppercase tracking-wider">View</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 p-16 text-center">
            <p className="text-gray-500 text-lg mb-2">No comparison history found</p>
            <p className="text-gray-400 text-sm mb-6">Start comparing retailers to see your history here</p>
            <Link to="/comparison">
              <button className="bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
                Start Comparing
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};


