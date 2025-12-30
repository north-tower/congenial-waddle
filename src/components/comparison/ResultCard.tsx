import React from 'react';
import type { DeliveryMethod } from '../../types';
import { formatDuration } from '../../utils/formatters';
import { Truck, Clock, DollarSign, Award } from 'lucide-react';

interface ResultCardProps {
  retailerName: string;
  deliveryMethods: DeliveryMethod[];
  hasData: boolean;
}

// Helper to parse cost string to number for sorting
const parseCost = (cost: string): number => {
  const num = parseFloat(cost.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
};

export const ResultCard: React.FC<ResultCardProps> = ({
  retailerName,
  deliveryMethods,
  hasData,
}) => {
  if (!hasData || deliveryMethods.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold text-lg">
                {retailerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-normal text-black tracking-tight">{retailerName}</h3>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wider border border-gray-300 px-3 py-1">
            No data
          </span>
        </div>
      </div>
    );
  }

  // Sort delivery methods by cost (parse string to number)
  const sortedMethods = [...deliveryMethods].sort((a, b) => parseCost(a.cost) - parseCost(b.cost));
  const cheapestMethod = sortedMethods[0];

  return (
    <div className="bg-white border border-gray-200 hover:border-black transition-colors">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {retailerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-normal text-black tracking-tight">{retailerName}</h3>
              <p className="text-xs text-gray-500">
                {deliveryMethods.length} shipping {deliveryMethods.length === 1 ? 'option' : 'options'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Cheapest Option Highlight */}
        {cheapestMethod && (
          <div className="bg-gray-50 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="text-black" />
              <span className="text-xs font-medium text-black uppercase tracking-wider">Best Value</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">{cheapestMethod.method}</p>
                <p className="text-xs text-gray-600 mt-1">{formatDuration(cheapestMethod.duration)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-black">{cheapestMethod.cost}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Methods */}
      <div className="p-6 space-y-4">
        {sortedMethods.map((method, index) => (
          <div
            key={`${method.method}-${index}`}
            className={`pb-4 ${index < sortedMethods.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={14} className="text-gray-400" />
                  <h4 className="font-normal text-black text-sm">{method.method}</h4>
                  {index === 0 && (
                    <span className="text-xs bg-black text-white px-2 py-0.5 uppercase tracking-wider">
                      Cheapest
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-gray-400" />
                    <span className="text-sm text-black font-medium">{method.cost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{formatDuration(method.duration)}</span>
                  </div>
                </div>
                {(method.additionalNotes || method.notes) && (
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {method.additionalNotes || method.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

