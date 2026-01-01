import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRetailer } from '../hooks/useRetailers';
import { useCountries } from '../hooks/useCountries';
import { useAuth } from '../context/AuthContext';
import { Skeleton, SkeletonCard } from '../components/common/Skeleton';
import { deliveryDataApi, type DeliveryData } from '../api/deliveryData';
import { useQuery } from '@tanstack/react-query';
import { analytics } from '../utils/analytics';
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Package,
  Clock,
  Truck,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MapPin,
} from 'lucide-react';

const RetailerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: retailer, isLoading: isLoadingRetailer } = useRetailer(id || '');
  const { data: countries = [] } = useCountries();
  const { isAuthenticated } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  // Fetch delivery data for this retailer
  const { data: deliveryData = [], isLoading: isLoadingDelivery } = useQuery<DeliveryData[]>({
    queryKey: ['deliveryData', 'retailer', id],
    queryFn: () => deliveryDataApi.getAll({ retailerId: id || '' }),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  // Get unique countries for this retailer
  const availableCountries = useMemo(() => {
    const countryIds = new Set(deliveryData.map((data) => data.countryId));
    return countries.filter((country) => countryIds.has(country.id));
  }, [deliveryData, countries]);

  // Track retailer view
  useEffect(() => {
    if (retailer) {
      analytics.trackRetailerView(retailer.id, retailer.name);
    }
  }, [retailer]);

  // Get delivery methods for selected country
  const countryDeliveryMethods = useMemo(() => {
    if (!selectedCountry) return [];
    return deliveryData.filter((data) => data.countryId === selectedCountry);
  }, [deliveryData, selectedCountry]);

  // Get stats
  const stats = useMemo(() => {
    const uniqueCountries = new Set(deliveryData.map((data) => data.countryId));
    const uniqueMethods = new Set(deliveryData.map((data) => data.method));
    const methodsWithFreeShipping = deliveryData.filter(
      (data) => data.freeShippingThreshold
    ).length;

    return {
      countries: uniqueCountries.size,
      methods: uniqueMethods.size,
      freeShippingOptions: methodsWithFreeShipping,
      totalOptions: deliveryData.length,
    };
  }, [deliveryData]);

  const handleCompare = () => {
    if (selectedCountry && isAuthenticated) {
      navigate(`/comparison?retailer=${id}&country=${selectedCountry}`);
    } else if (isAuthenticated) {
      navigate(`/comparison?retailer=${id}`);
    }
  };

  const formatCurrency = (cost: string): string => {
    if (cost.toLowerCase().includes('free')) return 'Free';
    return cost;
  };

  if (isLoadingRetailer || isLoadingDelivery) {
    return (
      <div className="bg-white min-h-screen">
        {/* Breadcrumbs Skeleton */}
        <div className="bg-gray-50 border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Skeleton height={16} width={200} />
            </div>
          </div>
        </div>

        {/* Header Skeleton */}
        <div className="bg-black text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Skeleton height={20} width={150} className="mb-6 bg-gray-700" />
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Skeleton variant="circular" width={128} height={128} className="bg-gray-700" />
                <div className="flex-1">
                  <Skeleton height={48} width="60%" className="mb-4 bg-gray-700" />
                  <Skeleton height={20} width={150} className="bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <div>
                <SkeletonCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!retailer) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-light text-black mb-3 tracking-tight">
            Retailer not found
          </h2>
          <p className="text-gray-600 mb-6">
            The retailer you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/retailers"
            className="inline-block bg-black text-white px-6 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors rounded-sm"
          >
            Back to Retailers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-black transition-colors">
                Home
              </Link>
            <span>/</span>
              <Link to="/retailers" className="hover:text-black transition-colors">
                Retailers
              </Link>
            <span>/</span>
            <span className="text-black">{retailer.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-black text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
          <Link
            to="/retailers"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 text-sm"
          >
              <ArrowLeft size={18} />
              Back to Retailers
          </Link>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-black text-4xl md:text-5xl font-bold">
                      {retailer.name.charAt(0).toUpperCase()}
                    </span>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-light mb-3 tracking-tight">
                {retailer.name}
                </h1>
              {retailer.website && (
                <a
                  href={retailer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Visit Website
                    <ExternalLink size={16} />
                </a>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <div className="bg-white border border-gray-200 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Globe size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-black mb-1">{stats.countries}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wider">
                Countries Covered
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <Package size={20} className="text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-black mb-1">{stats.methods}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wider">
                Delivery Methods
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} className="text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-black mb-1">
                {stats.freeShippingOptions}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wider">
                Free Shipping Options
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                  <TrendingUp size={20} className="text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-black mb-1">{stats.totalOptions}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wider">
                Total Options
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Available Countries */}
              {availableCountries.length > 0 && (
                <div className="bg-white border border-gray-200 p-6 rounded-sm">
                  <h2 className="text-xl font-medium text-black mb-4 tracking-tight flex items-center gap-2">
                    <MapPin size={24} className="text-gray-400" />
                    Countries with Delivery Data
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableCountries.map((country) => {
                      const countryDataCount = deliveryData.filter(
                        (data) => data.countryId === country.id
                      ).length;
                      return (
                        <div
                          key={country.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-sm hover:border-black transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Globe size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-black">{country.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{countryDataCount}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Methods by Country */}
              {selectedCountry && countryDeliveryMethods.length > 0 && (
                <div className="bg-white border border-gray-200 p-6 rounded-sm">
                  <h2 className="text-xl font-medium text-black mb-4 tracking-tight">
                    Delivery Methods for{' '}
                    {countries.find((c) => c.id === selectedCountry)?.name}
                  </h2>
                  <div className="space-y-4">
                    {countryDeliveryMethods.map((method, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 p-4 rounded-sm hover:border-black transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Truck size={18} className="text-gray-400" />
                              <h3 className="text-base font-medium text-black">
                                {method.method}
              </h3>
                            </div>
                            {method.carrier && (
                              <p className="text-xs text-gray-500 mb-2">Carrier: {method.carrier}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-black mb-1">
                              {formatCurrency(method.cost)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock size={14} />
                              {method.duration}
                            </div>
                          </div>
                        </div>
                        {method.freeShippingThreshold && (
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle size={16} />
                              <span>
                                Free shipping on orders over {method.freeShippingThreshold}
                              </span>
                            </div>
                          </div>
                        )}
                        {method.additionalNotes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-600">{method.additionalNotes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCountry && countryDeliveryMethods.length === 0 && (
                <div className="bg-white border border-gray-200 p-6 rounded-sm text-center">
                  <p className="text-gray-600">
                    No delivery methods available for the selected country.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Compare CTA */}
              <div className="bg-white border border-gray-200 p-6 rounded-sm sticky top-24">
            {isAuthenticated ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black mb-4 tracking-tight">
                      Compare Shipping
                    </h3>
                <div>
                      <label className="block text-xs text-gray-600 mb-2 uppercase tracking-wider">
                    Select Country
                  </label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full bg-white border border-gray-300 text-black px-4 py-3 focus:outline-none focus:border-black transition-colors text-sm"
                      >
                        <option value="">Select a country</option>
                        {availableCountries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                    <button
                      onClick={handleCompare}
                      disabled={!selectedCountry}
                      className="w-full bg-black text-white px-6 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors rounded-sm"
                    >
                    Compare Shipping Options
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      Compare {retailer.name} with other retailers
                    </p>
              </div>
            ) : (
              <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black mb-4 tracking-tight">
                      Get Started
                    </h3>
                <p className="text-sm text-gray-600 mb-4">
                      Sign in to compare shipping options and access detailed delivery data.
                    </p>
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        className="block w-full bg-white border-2 border-black text-black px-6 py-3 text-sm font-medium tracking-wider hover:bg-black hover:text-white transition-colors text-center rounded-sm"
                      >
                      Sign In
                  </Link>
                      <Link
                        to="/register"
                        className="block w-full bg-black text-white px-6 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors text-center rounded-sm"
                      >
                        Create Account
                  </Link>
                </div>
              </div>
            )}
              </div>

              {/* Quick Info */}
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                <h3 className="text-base font-medium text-black mb-4 tracking-tight">
                  About This Retailer
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Verified shipping data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Updated monthly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Multiple delivery methods</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDetail;
