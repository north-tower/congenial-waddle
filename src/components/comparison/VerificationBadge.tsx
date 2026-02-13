import React from 'react';
import { CheckCircle, Clock, ExternalLink, Shield, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  lastVerified?: string;
  verificationStatus?: 'verified' | 'pending' | 'needs_verification';
  sourceUrl?: string;
  showDetails?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  lastVerified,
  verificationStatus = 'verified',
  sourceUrl,
  showDetails = false,
}) => {
  const getStatusConfig = () => {
    switch (verificationStatus) {
      case 'verified':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: 'text-green-600',
          label: 'Verified',
          description: 'Data verified from official source',
        };
      case 'pending':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          iconColor: 'text-yellow-600',
          label: 'Pending Verification',
          description: 'Verification in progress',
        };
      case 'needs_verification':
        return {
          icon: AlertCircle,
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-600',
          label: 'Needs Verification',
          description: 'Data may need updating',
        };
      default:
        return {
          icon: Shield,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-600',
          label: 'Unverified',
          description: 'Verification status unknown',
        };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm ${config.bgColor} ${config.textColor}`}>
      <Icon size={14} className={config.iconColor} />
      <span className="text-xs font-medium">{config.label}</span>
      {showDetails && lastVerified && (
        <span className="text-xs opacity-75">• {formatDate(lastVerified)}</span>
      )}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 hover:opacity-80 transition-opacity"
          title="View source on retailer website"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={12} className={config.iconColor} />
        </a>
      )}
    </div>
  );
};

interface DataVerificationSectionProps {
  lastUpdated?: string;
  verificationRate?: number;
  totalRetailers?: number;
  verifiedRetailers?: number;
}

export const DataVerificationSection: React.FC<DataVerificationSectionProps> = ({
  lastUpdated,
  verificationRate = 95,
  totalRetailers,
  verifiedRetailers,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-gray-600" />
          <div>
            <h3 className="text-sm font-medium text-black mb-1">Data Verification</h3>
            <p className="text-xs text-gray-600">
              {verificationRate}% of data verified from official sources
              {lastUpdated && ` • Last updated ${new Date(lastUpdated).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`}
            </p>
          </div>
        </div>
        {totalRetailers && verifiedRetailers !== undefined && (
          <div className="text-right">
            <div className="text-sm font-medium text-black">
              {verifiedRetailers}/{totalRetailers} verified
            </div>
            <div className="text-xs text-gray-600">retailers</div>
          </div>
        )}
      </div>
    </div>
  );
};
