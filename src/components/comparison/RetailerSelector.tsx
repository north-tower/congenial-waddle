import React from 'react';
import type { Retailer } from '../../types';

interface RetailerSelectorProps {
  selectedRetailers: Retailer[];
  onRemove: (retailerId: string) => void;
}

export const RetailerSelector: React.FC<RetailerSelectorProps> = ({
  selectedRetailers,
  onRemove,
}) => {
  if (selectedRetailers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {selectedRetailers.map((retailer) => (
        <div
          key={retailer.id}
          className="inline-flex items-center px-4 py-2 border border-black bg-white text-black text-sm font-normal"
        >
          <span>{retailer.name}</span>
          <button
            type="button"
            onClick={() => onRemove(retailer.id)}
            className="ml-3 hover:text-gray-600 transition-colors"
            aria-label={`Remove ${retailer.name}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

