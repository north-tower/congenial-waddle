import React from 'react';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';
import type { CurrencyCode } from '../../context/CurrencyContext';

interface CurrencySelectorProps {
  className?: string;
  label?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = '',
  label = 'Default Currency',
}) => {
  const { currency, setCurrency, currencySymbol } = useCurrency();

  return (
    <div className={className}>
      <label className="block text-xs text-black mb-3 uppercase tracking-wider font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="w-full px-4 py-2 border border-black rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none cursor-pointer"
        >
          {CURRENCIES.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.symbol} {curr.name} ({curr.code})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-600">
        Prices will be displayed in {currencySymbol} ({currency})
      </p>
    </div>
  );
};
