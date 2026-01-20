import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]['code'];

// Also export as a value type for runtime use if needed
export type { CurrencyCode as CurrencyCodeType };

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  currencySymbol: string;
  currencyName: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'preferred_currency';
const DEFAULT_CURRENCY: CurrencyCode = 'USD';

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && CURRENCIES.some((c) => c.code === stored)) {
      return stored as CurrencyCode;
    }
    return DEFAULT_CURRENCY;
  });

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
  };

  const currencyInfo = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    currencySymbol: currencyInfo.symbol,
    currencyName: currencyInfo.name,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};
