import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useRetailers } from '../hooks/useRetailers';
import { Skeleton } from '../components/common/Skeleton';
import {
  Search,
  Grid3x3,
  List,
  ArrowUpDown,
  ArrowUpAZ,
  ArrowDownZA,
  Package,
  TrendingUp,
  Globe,
  AlertCircle,
} from 'lucide-react';

type SortOption = 'name-asc' | 'name-desc' | 'popular';
type ViewMode = 'grid' | 'list';

const Retailers: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { data: retailers = [], isLoading, error } = useRetailers();

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Filter and sort retailers
  const filteredAndSortedRetailers = useMemo(() => {
    let filtered = retailers.filter((retailer) =>
      retailer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'popular':
          // For now, just sort by name since we don't have popularity data
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [retailers, searchQuery, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Update URL without page reload
    if (value.trim()) {
      setSearchParams({ search: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'name-asc':
        return <ArrowUpAZ size={18} />;
      case 'name-desc':
        return <ArrowDownZA size={18} />;
      default:
        return <ArrowUpDown size={18} />;
    }
  };

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 text-center rounded-sm">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="text-base">Error loading retailers. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-black text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Retailers'}
            </h1>
            <p className="text-gray-300 text-base">
              Browse our comprehensive database of retailers with verified shipping data
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-gray-600" />
                  <span className="text-gray-700">
                    <span className="font-medium text-black">{filteredAndSortedRetailers.length}</span>{' '}
                    {filteredAndSortedRetailers.length === 1 ? 'retailer' : 'retailers'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-gray-600" />
                  <span className="text-gray-700">10+ countries</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-gray-600" />
                  <span className="text-gray-700">Updated monthly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search retailers..."
                    className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 px-4 py-2.5 pr-10 focus:outline-none focus:border-black transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-white border border-gray-300 text-black px-4 py-2.5 pr-10 focus:outline-none focus:border-black transition-colors text-sm cursor-pointer"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="popular">Popular</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {getSortIcon()}
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 border-l border-gray-300 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retailers Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Skeleton variant="rectangular" className="aspect-[3/4] mb-3" />
                  <Skeleton height={16} width="75%" className="mb-2" />
                  <Skeleton height={12} width="50%" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedRetailers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-light text-black mb-3 tracking-tight">
                No retailers found
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `No retailers match "${searchQuery}". Try a different search term.`
                  : 'No retailers available at the moment.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchParams({});
                  }}
                  className="text-black hover:text-gray-600 text-sm uppercase tracking-wider underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSortedRetailers.map((retailer) => (
                <Link
                  key={retailer.id}
                  to={`/retailers/${retailer.id}`}
                  className="group"
                >
                  <div className="bg-gray-100 aspect-[3/4] mb-3 relative overflow-hidden rounded-sm">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-24 h-24 bg-black rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white text-3xl font-bold">
                            {retailer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-xl font-medium text-black">{retailer.name}</h3>
                      </div>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  </div>
                  <div>
                    <p className="text-sm text-black font-medium mb-1 group-hover:underline">
                      {retailer.name}
                    </p>
                    <p className="text-xs text-gray-600">Compare shipping options</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredAndSortedRetailers.map((retailer) => (
                <Link
                  key={retailer.id}
                  to={`/retailers/${retailer.id}`}
                  className="group flex items-center gap-6 p-6 bg-white border border-gray-200 hover:border-black hover:shadow-md transition-all duration-200 rounded-sm"
                >
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl font-bold">
                      {retailer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-black mb-1 group-hover:underline">
                      {retailer.name}
                    </h3>
                    <p className="text-sm text-gray-600">Compare shipping options across countries</p>
                    {retailer.website && (
                      <p className="text-xs text-gray-500 mt-1">{retailer.website}</p>
                    )}
                  </div>
                  <div className="text-gray-400 group-hover:text-black transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Retailers;
