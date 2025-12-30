import React, { useState, useEffect, useRef } from 'react';
import { useRetailerSearch } from '../../hooks/useRetailers';
import type { Retailer } from '../../types';
import { Input } from '../common/Input';
import { Skeleton } from '../common/Skeleton';

interface RetailerSearchProps {
  onSelect: (retailer: Retailer) => void;
  selectedRetailerIds: string[];
  maxSelections?: number;
}

export const RetailerSearch: React.FC<RetailerSearchProps> = ({
  onSelect,
  selectedRetailerIds,
  maxSelections = 10,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: retailers, isLoading } = useRetailerSearch(
    debouncedQuery,
    debouncedQuery.length > 0
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (retailer: Retailer) => {
    if (selectedRetailerIds.length >= maxSelections) {
      return;
    }
    if (!selectedRetailerIds.includes(retailer.id)) {
      onSelect(retailer);
    }
    setSearchQuery('');
    setIsOpen(false);
  };

  const filteredRetailers = retailers?.filter(
    (retailer) => !selectedRetailerIds.includes(retailer.id)
  ) || [];

  const isMaxReached = selectedRetailerIds.length >= maxSelections;

  return (
    <div ref={searchRef} className="relative w-full">
      <Input
        type="text"
        placeholder={isMaxReached ? `Maximum ${maxSelections} retailers selected` : 'Search for retailers...'}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        disabled={isMaxReached}
        helperText={isMaxReached ? `You can select up to ${maxSelections} retailers` : `${selectedRetailerIds.length}/${maxSelections} selected`}
      />

      {isOpen && searchQuery.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-black max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="py-2">
                  <Skeleton height={20} width="80%" className="mb-1" />
                  <Skeleton height={16} width="60%" />
                </div>
              ))}
            </div>
          ) : filteredRetailers.length > 0 ? (
            <ul className="py-1">
              {filteredRetailers.map((retailer) => (
                <li
                  key={retailer.id}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-200 last:border-0"
                  onClick={() => handleSelect(retailer)}
                >
                  <div className="font-normal text-black">{retailer.name}</div>
                  {retailer.website && (
                    <div className="text-sm text-gray-500 mt-1">{retailer.website}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No retailers found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

