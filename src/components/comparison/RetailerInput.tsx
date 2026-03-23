import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { Input } from '../common/Input';
import { Plus, X, Search } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Known retailers for autocomplete suggestions.
 * These match the retailers with verified shipping URLs in the backend.
 */
const KNOWN_RETAILERS: string[] = [
  // Featured retailers (from landing page)
  'ASOS',
  'Zara',
  'H&M',
  'Nike',
  'Uniqlo',
  'Lululemon',
  'Gymshark',
  'ASICS',
  'Mango',
  'Boohoo',
  'All Saints',
  'Clarks',
  'COS',
  'Next',
  'River Island',
  'M&S',
  'Sports Direct',
  'Shein',
  'TK Maxx',
  'Zalando',
  // US / Global
  'Amazon',
  'eBay',
  'Walmart',
  'Target',
  'Best Buy',
  // Additional popular retailers
  'Adidas',
  'New Balance',
  'Puma',
  'John Lewis',
  'Superdry',
  'Gap',
  'Pull & Bear',
  'Bershka',
  'Massimo Dutti',
  'JD Sports',
  'Foot Locker',
  'New Look',
  'Under Armour',
  'The North Face',
  'Converse',
  'Vans',
  'Ted Baker',
  'Reiss',
  'Whistles',
  'Karen Millen',
  'Office',
  'Schuh',
  'Selfridges',
  'Harrods',
  'Harvey Nichols',
  'Arket',
  'Weekday',
  'Monki',
  '& Other Stories',
];

interface RetailerInputProps {
  selectedRetailers: string[];
  onAdd: (retailerName: string) => void;
  onRemove: (retailerName: string) => void;
  maxSelections?: number;
  error?: string;
}

export const RetailerInput: React.FC<RetailerInputProps> = ({
  selectedRetailers,
  onAdd,
  onRemove,
  maxSelections = 10,
  error,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const isMaxReached = selectedRetailers.length >= maxSelections;

  // Filter suggestions based on input
  const suggestions = inputValue.trim()
    ? KNOWN_RETAILERS.filter((retailer) => {
        const matchesQuery = retailer.toLowerCase().includes(inputValue.toLowerCase());
        const alreadySelected = selectedRetailers.some(
          (r) => r.toLowerCase() === retailer.toLowerCase()
        );
        return matchesQuery && !alreadySelected;
      })
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      const item = items[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleAdd = useCallback(
    (name?: string) => {
      const value = (name || inputValue).trim();
      if (value && !isMaxReached) {
      const exists = selectedRetailers.some(
          (r) => r.toLowerCase() === value.toLowerCase()
      );
      if (!exists) {
          onAdd(value);
        setInputValue('');
          setIsDropdownOpen(false);
          setHighlightedIndex(-1);
      }
    }
    },
    [inputValue, isMaxReached, selectedRetailers, onAdd]
  );

  const handleSelectSuggestion = (retailerName: string) => {
    handleAdd(retailerName);
    // Re-focus input for quick multi-add
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isDropdownOpen && suggestions.length > 0) {
        setIsDropdownOpen(true);
      }
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[highlightedIndex]);
      } else {
      handleAdd();
    }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Tab' && isDropdownOpen && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setHighlightedIndex(-1);
    setIsDropdownOpen(value.trim().length > 0);
  };

  // Highlight the matching part of a suggestion
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, index)}
        <span className="font-semibold text-black">{text.slice(index, index + query.length)}</span>
        {text.slice(index + query.length)}
      </>
    );
  };

  // Check if current input exactly matches a known retailer (case-insensitive)
  const isKnownRetailer = KNOWN_RETAILERS.some(
    (r) => r.toLowerCase() === inputValue.trim().toLowerCase()
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2" ref={dropdownRef}>
        <div className="relative w-full">
        <Input
            ref={inputRef}
          type="text"
          placeholder={
            isMaxReached
              ? `Maximum ${maxSelections} retailers selected`
                : 'Start typing a retailer name...'
          }
          value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim().length > 0) {
                setIsDropdownOpen(true);
              }
            }}
          disabled={isMaxReached}
          error={error}
            autoComplete="off"
        />

          {/* Autocomplete dropdown */}
          {isDropdownOpen && suggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-auto rounded-sm">
              <ul ref={listRef} className="py-1" role="listbox">
                {suggestions.map((retailer, index) => (
                  <li
                    key={retailer}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    className={`px-4 py-2.5 cursor-pointer transition-colors text-sm flex items-center gap-2 ${
                      index === highlightedIndex
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSelectSuggestion(retailer)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <Search
                      size={14}
                      className={
                        index === highlightedIndex ? 'text-gray-400' : 'text-gray-400'
                      }
                    />
                    <span>
                      {index === highlightedIndex
                        ? retailer
                        : highlightMatch(retailer, inputValue)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* "Add custom" option if input doesn't match a known retailer */}
              {!isKnownRetailer && inputValue.trim().length > 0 && (
                <div
                  className="px-4 py-2.5 border-t border-gray-200 cursor-pointer hover:bg-gray-50 text-sm text-gray-500 flex items-center gap-2"
                  onClick={() => handleAdd()}
                >
                  <Plus size={14} />
                  <span>
                    Add "<span className="font-medium text-black">{inputValue.trim()}</span>" as
                    custom retailer
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Show "no results" with custom add option when nothing matches */}
          {isDropdownOpen && suggestions.length === 0 && inputValue.trim().length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 shadow-lg rounded-sm">
              <div
                className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm text-gray-500 flex items-center gap-2"
                onClick={() => handleAdd()}
              >
                <Plus size={14} />
                <span>
                  Add "<span className="font-medium text-black">{inputValue.trim()}</span>" as
                  custom retailer
                </span>
              </div>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleAdd()}
          disabled={isMaxReached || !inputValue.trim()}
          className="whitespace-nowrap"
        >
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      {selectedRetailers.length > 0 && (
        <div>
          <label className="block text-xs text-black mb-3 uppercase tracking-wider font-medium">
            Selected Retailers ({selectedRetailers.length}/{maxSelections})
          </label>
          <div className="flex flex-wrap gap-3">
            {selectedRetailers.map((retailer) => (
              <div
                key={retailer}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-sm"
              >
                <span className="text-sm text-black">{retailer}</span>
                <button
                  type="button"
                  onClick={() => onRemove(retailer)}
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label={`Remove ${retailer}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isMaxReached && (
        <p className="text-xs text-gray-500">
          Start typing to see suggestions, or enter any retailer name. Press Enter or click Add.
          Up to {maxSelections} retailers.
        </p>
      )}
    </div>
  );
};
