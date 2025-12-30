import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComparisonHistory } from '../hooks/useComparison';
import { Skeleton, SkeletonCard, SkeletonTable } from '../components/common/Skeleton';
import {
  GitCompare,
  History,
  TrendingUp,
  Package,
  Globe,
  DollarSign,
  Eye,
  Download,
  Trash2,
  Search,
  ArrowRight,
  Play,
  Bell,
  FileText,
  AlertCircle,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface StatCard {
  Icon: React.ComponentType<LucideProps>;
  iconColor: string;
  bgColor: string;
  value: string | number;
  label: string;
  trend?: string;
  trendPositive?: boolean;
}

interface FavoriteRetailer {
  name: string;
  count: number;
  rank: number;
}

interface CoverageItem {
  country: string;
  count: number;
}

const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(then);
};

const getPlanBadgeColor = (plan: string): string => {
  switch (plan) {
    case 'professional':
      return 'bg-purple-500';
    case 'enterprise':
      return 'bg-yellow-500';
    case 'starter':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const getPlanLabel = (plan: string): string => {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};

const getUserInitials = (name: string | null, email: string): string => {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return email[0].toUpperCase();
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: history = [], isLoading, error } = useComparisonHistory();

  // Calculate stats from history
  const stats = useMemo<StatCard[]>(() => {
    const totalComparisons = history.length;
    const retailersSet = new Set<string>();
    const countriesSet = new Set<string>();

    history.forEach((item) => {
      item.retailerNames.forEach((r) => retailersSet.add(r));
      countriesSet.add(item.countryName);
    });

    return [
      {
        Icon: TrendingUp,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        value: totalComparisons,
        label: 'Total Comparisons',
        trend: '+5 this week',
        trendPositive: true,
      },
      {
        Icon: Package,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        value: retailersSet.size,
        label: 'Retailers Compared',
        trend: '+3 this month',
        trendPositive: true,
      },
      {
        Icon: Globe,
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        value: countriesSet.size,
        label: 'Countries Covered',
      },
      {
        Icon: DollarSign,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        value: '12%',
        label: 'Avg Savings Found',
        trend: 'vs market average',
      },
    ];
  }, [history]);

  // Calculate favorite retailers
  const favoriteRetailers = useMemo<FavoriteRetailer[]>(() => {
    const retailerCounts: Record<string, number> = {};
    history.forEach((item) => {
      item.retailerNames.forEach((retailer) => {
        retailerCounts[retailer] = (retailerCounts[retailer] || 0) + 1;
      });
    });

    return Object.entries(retailerCounts)
      .map(([name, count]) => ({ name, count, rank: 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [history]);

  // Calculate coverage
  const coverage = useMemo<CoverageItem[]>(() => {
    const countryCounts: Record<string, number> = {};
    history.forEach((item) => {
      countryCounts[item.countryName] = (countryCounts[item.countryName] || 0) + 1;
    });

    return Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [history]);

  // Recent comparisons (last 5)
  const recentComparisons = useMemo(() => {
    return history.slice(0, 5).map((item) => ({
      ...item,
      isNew: new Date().getTime() - new Date(item.createdAt).getTime() < 86400000,
    }));
  }, [history]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Welcome Banner Skeleton */}
          <div className="bg-black text-white p-8 md:p-10 mb-8 rounded-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <Skeleton height={40} width="60%" className="mb-4 bg-gray-700" />
                <Skeleton height={20} width="80%" className="bg-gray-700" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton height={32} width={100} className="bg-gray-700 rounded-sm" />
                <Skeleton variant="circular" width={48} height={48} className="bg-gray-700" />
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Action Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white border border-gray-200 rounded-sm mb-8 p-6">
            <Skeleton height={28} width={200} className="mb-6" />
            <SkeletonTable rows={5} cols={5} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 text-center rounded-sm">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="text-base">Error loading dashboard. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const hasComparisons = history.length > 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Welcome Banner */}
        <div className="bg-black text-white p-8 md:p-10 mb-8 rounded-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-light mb-2 tracking-tight">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-300 text-sm md:text-base">
                Here's your shipping comparison overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user?.plan && (
                <span
                  className={`px-4 py-2 text-sm font-medium text-white rounded-sm ${getPlanBadgeColor(
                    user.plan
                  )}`}
                >
                  {getPlanLabel(user.plan)} Plan
                </span>
              )}
              <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-sm font-medium">
                {getUserInitials(user?.name || null, user?.email || '')}
              </div>
            </div>
          </div>
        </div>

        {!hasComparisons ? (
          /* Empty State */
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-light text-black mb-4 tracking-tight">
              Start Your First Comparison
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Compare shipping costs across multiple retailers and countries to find the best deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/comparison"
                className="inline-block bg-black text-white px-8 py-4 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors rounded-sm"
              >
                Create Comparison
              </Link>
              <button className="inline-block bg-white text-black border-2 border-black px-8 py-4 text-sm font-medium tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm flex items-center justify-center gap-2">
                <Play size={20} />
                Watch Demo
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.Icon;
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                        <IconComponent size={24} className={stat.iconColor} />
                      </div>
                      {stat.trend && (
                        <span
                          className={`text-xs font-medium ${
                            stat.trendPositive ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          {stat.trendPositive && '↑'} {stat.trend}
                        </span>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-black mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* New Comparison */}
              <Link
                to="/comparison"
                className="group relative bg-white border border-gray-200 p-8 hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-sm overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <GitCompare size={64} className="text-black mb-6 relative z-10" />
                <h3 className="text-xl font-medium text-black mb-3 tracking-tight relative z-10">
                  New Comparison
                </h3>
                <p className="text-gray-600 text-sm mb-6 relative z-10">
                  Compare shipping costs across multiple retailers for any country
                </p>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-sm font-medium text-black uppercase tracking-wider">
                    Start Comparing
                  </span>
                  <ArrowRight size={20} className="text-black group-hover:translate-x-1 transition-transform" />
                </div>
                {history.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 relative z-10">
                    Last: {recentComparisons[0]?.retailerNames.slice(0, 2).join(', ')}
                  </div>
                )}
              </Link>

              {/* View History */}
              <Link
                to="/history"
                className="group relative bg-white border border-gray-200 p-8 hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-sm overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <History size={64} className="text-black mb-6 relative z-10" />
                <h3 className="text-xl font-medium text-black mb-3 tracking-tight relative z-10">
                  View History
                </h3>
                <p className="text-gray-600 text-sm mb-6 relative z-10">
                  Access your previous comparison results and saved searches
                </p>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-sm font-medium text-black uppercase tracking-wider">
                    View History
                  </span>
                  <ArrowRight size={20} className="text-black group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 relative z-10">
                  {history.length} {history.length === 1 ? 'comparison' : 'comparisons'} total
                </div>
              </Link>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white border border-gray-200 rounded-sm mb-8 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-medium text-black tracking-tight">Recent Comparisons</h2>
                <Link
                  to="/history"
                  className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                >
                  View All History
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Retailers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Winner
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentComparisons.map((comparison) => (
                      <tr
                        key={comparison.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">
                              {formatRelativeTime(comparison.createdAt)}
                            </span>
                            {comparison.isNew && (
                              <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded">
                                New
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {comparison.retailerNames.slice(0, 3).join(', ')}
                            {comparison.retailerNames.length > 3 &&
                              ` +${comparison.retailerNames.length - 3}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Globe size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-900">{comparison.countryName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded">
                            {comparison.retailerNames[0]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/comparison/${comparison.id}`}
                              className="text-gray-600 hover:text-black transition-colors"
                              title="View"
                            >
                              <Eye size={18} />
                            </Link>
                            <button
                              className="text-gray-600 hover:text-black transition-colors"
                              title="Export"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Favorite Retailers */}
              <div className="bg-white border border-gray-200 p-6 rounded-sm">
                <h3 className="text-lg font-medium text-black mb-4 tracking-tight">
                  Your Most Compared Retailers
                </h3>
                <div className="space-y-3">
                  {favoriteRetailers.map((retailer, index) => {
                    const medals = ['🏆', '🥈', '🥉'];
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {index < 3 ? medals[index] : `${retailer.rank}.`}
                          </span>
                          <span className="text-sm font-medium text-black">{retailer.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {retailer.count} {retailer.count === 1 ? 'time' : 'times'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Link
                  to="/retailers"
                  className="mt-4 text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                >
                  View All Retailers
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Coverage Highlights */}
              <div className="bg-white border border-gray-200 p-6 rounded-sm">
                <h3 className="text-lg font-medium text-black mb-4 tracking-tight flex items-center gap-2">
                  <Globe size={20} className="text-gray-400" />
                  Your Coverage Summary
                </h3>
                <div className="space-y-3">
                  {coverage.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm font-medium text-black">{item.country}</span>
                      <span className="text-sm text-gray-500">
                        {item.count} {item.count === 1 ? 'comparison' : 'comparisons'}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/coverage"
                  className="mt-4 text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                >
                  Explore Full Coverage
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-black mb-4 tracking-tight">
                Suggested for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-sm hover:shadow-lg transition-shadow">
                  <Package size={32} className="text-black mb-4" />
                  <h3 className="text-base font-medium text-black mb-2">
                    Try comparing {favoriteRetailers[0]?.name || 'more retailers'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Expand your comparison to discover better shipping rates
                  </p>
                  <Link
                    to="/comparison"
                    className="inline-block text-sm font-medium text-black hover:text-gray-600 transition-colors"
                  >
                    Start Comparison →
                  </Link>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-sm hover:shadow-lg transition-shadow">
                  <FileText size={32} className="text-black mb-4" />
                  <h3 className="text-base font-medium text-black mb-2">Export your data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download your comparison history as CSV or PDF
                  </p>
                  <button className="inline-block text-sm font-medium text-black hover:text-gray-600 transition-colors">
                    Export Now →
                  </button>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-sm hover:shadow-lg transition-shadow">
                  <Bell size={32} className="text-black mb-4" />
                  <h3 className="text-base font-medium text-black mb-2">Enable alerts</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get notified when prices change for your favorite retailers
                  </p>
                  <button className="inline-block text-sm font-medium text-black hover:text-gray-600 transition-colors">
                    Setup Alerts →
                  </button>
                </div>
              </div>
            </div>

            {/* Plan Usage (for paid plans) */}
            {user?.plan && user.plan !== 'free' && (
              <div className="bg-white border border-gray-200 p-6 rounded-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-black tracking-tight">Plan Usage</h2>
                  <div className="flex gap-4">
                    <Link
                      to="/billing/upgrade"
                      className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      Upgrade Plan
                    </Link>
                    <Link
                      to="/billing"
                      className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      View Billing
                    </Link>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">API Calls</span>
                      <span className="text-black font-medium">1,250 / 10,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: '12.5%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Exports</span>
                      <span className="text-black font-medium">45 / 100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: '45%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">User Seats</span>
                      <span className="text-black font-medium">3 / 10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: '30%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
