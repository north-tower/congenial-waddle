import React from 'react';
import { useCountries } from '../../hooks/useCountries';
import { Select } from '../common/Select';
import { Skeleton } from '../common/Skeleton';

interface CountrySelectorProps {
  value: string;
  onChange: (countryId: string) => void;
  error?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const { data: countries, isLoading } = useCountries();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton height={16} width={80} />
        <Skeleton height={40} width="100%" />
      </div>
    );
  }

  const options =
    countries
      ?.sort((a, b) => a.name.localeCompare(b.name))
      .map((country) => ({
        value: country.id,
        label: country.name,
      })) || [];

  return (
    <Select
      label="Country"
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      placeholder="Select a country"
      required
    />
  );
};


