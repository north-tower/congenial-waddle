import React, { useState, KeyboardEvent } from 'react';
import { Input } from '../common/Input';
import { Plus, X } from 'lucide-react';
import { Button } from '../common/Button';

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
  const isMaxReached = selectedRetailers.length >= maxSelections;

  const handleAdd = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !isMaxReached) {
      // Check if retailer already exists (case-insensitive)
      const exists = selectedRetailers.some(
        (r) => r.toLowerCase() === trimmedValue.toLowerCase()
      );
      if (!exists) {
        onAdd(trimmedValue);
        setInputValue('');
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={
            isMaxReached
              ? `Maximum ${maxSelections} retailers selected`
              : 'Enter retailer name (e.g., Amazon, eBay, Walmart)'
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isMaxReached}
          error={error}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
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
          Press Enter or click Add to add a retailer. You can add up to {maxSelections} retailers.
        </p>
      )}
    </div>
  );
};
