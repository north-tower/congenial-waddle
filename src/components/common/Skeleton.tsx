import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200';
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : '';
  
  const variantClasses = {
    text: 'rounded-sm',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white border border-gray-200 p-6 rounded-sm ${className}`}>
    <Skeleton variant="rectangular" height={48} width="60%" className="mb-4" />
    <Skeleton variant="text" height={16} className="mb-2" />
    <Skeleton variant="text" height={16} width="80%" />
  </div>
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => (
  <div className={className}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        height={16}
        width={i === lines - 1 ? '80%' : '100%'}
        className="mb-2"
      />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => <Skeleton variant="circular" width={size} height={size} className={className} />;

export const SkeletonButton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Skeleton variant="rectangular" height={40} width={120} className={`rounded-sm ${className}`} />
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="space-y-4">
    {/* Table Header */}
    <div className="flex gap-4 pb-4 border-b border-gray-200">
      {[...Array(cols)].map((_, i) => (
        <Skeleton key={i} variant="text" height={16} width="100%" />
      ))}
    </div>
    {/* Table Rows */}
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 py-4 border-b border-gray-200">
        {[...Array(cols)].map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" height={16} width="100%" />
        ))}
      </div>
    ))}
  </div>
);


