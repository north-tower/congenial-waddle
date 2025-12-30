import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Store, Package, CheckCircle, Calendar } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface Region {
  name: string;
  countries: string[];
}

interface Stat {
  Icon: React.ComponentType<LucideProps>;
  label: string;
  value: string;
}

const DataCoverageSection: React.FC = () => {
  const regions: Region[] = [
    {
      name: 'Europe',
      countries: ['Austria', 'Denmark', 'Sweden', 'Ireland', 'Norway', 'Switzerland', 'UK'],
    },
    {
      name: 'Oceania',
      countries: ['New Zealand'],
    },
    {
      name: 'Middle East',
      countries: ['UAE', 'Israel'],
    },
    {
      name: 'Asia-Pacific',
      countries: ['Australia'],
    },
    {
      name: 'North America',
      countries: ['USA', 'Canada'],
    },
  ];

  const stats: Stat[] = [
    { Icon: MapPin, label: 'Countries', value: '10+' },
    { Icon: Store, label: 'Retailers', value: '30+' },
    { Icon: Package, label: 'Delivery Methods', value: '366+' },
    { Icon: CheckCircle, label: 'Data Verified', value: '95%' },
    { Icon: Calendar, label: 'Updated', value: 'November 2025' },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Centered Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Comprehensive Global Coverage
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* World Map Visualization / Country Regions */}
          <div className="bg-white border border-gray-200 p-8 md:p-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regions.map((region, index) => (
                <div key={index} className="border-l-2 border-black pl-6">
                  <h3 className="text-lg font-medium text-black mb-4 tracking-tight">
                    {region.name}
                  </h3>
                  <ul className="space-y-2">
                    {region.countries.map((country, countryIndex) => (
                      <li
                        key={countryIndex}
                        className="text-gray-700 text-sm flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        {country}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.Icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex justify-center mb-4">
                    <IconComponent size={32} className="text-black" />
                  </div>
                  <div className="text-3xl font-light text-black mb-2 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              to="/comparison"
              className="inline-block bg-black text-white px-10 py-4 text-base font-medium tracking-wider hover:bg-gray-800 transition-colors rounded-sm"
            >
              See Full Coverage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataCoverageSection;

