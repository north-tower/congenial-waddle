import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Store, Package, CheckCircle, Calendar } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import countriesIllustration from '../../assets/stat-countries-illustration.svg';
import retailersIllustration from '../../assets/stat-retailers-illustration.svg';
import deliveryIllustration from '../../assets/stat-delivery-illustration.svg';
import verifiedIllustration from '../../assets/stat-verified-illustration.svg';
import updatedIllustration from '../../assets/stat-updated-illustration.svg';

interface Region {
  name: string;
  countries: string[];
}

interface Stat {
  Icon: React.ComponentType<LucideProps>;
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
  glowColor: string;
  imageUrl: string;
  imageAlt: string;
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
    {
      Icon: MapPin,
      label: 'Countries',
      value: '10+',
      iconColor: 'text-sky-600',
      iconBg: 'from-sky-50 to-blue-50',
      glowColor: 'group-hover:shadow-sky-100',
      imageUrl: countriesIllustration,
      imageAlt: 'World map on a desk',
    },
    {
      Icon: Store,
      label: 'Retailers',
      value: '30+',
      iconColor: 'text-indigo-600',
      iconBg: 'from-indigo-50 to-violet-50',
      glowColor: 'group-hover:shadow-indigo-100',
      imageUrl: retailersIllustration,
      imageAlt: 'Modern retail store interior',
    },
    {
      Icon: Package,
      label: 'Delivery Methods',
      value: '366+',
      iconColor: 'text-emerald-600',
      iconBg: 'from-emerald-50 to-green-50',
      glowColor: 'group-hover:shadow-emerald-100',
      imageUrl: deliveryIllustration,
      imageAlt: 'Packages in a warehouse',
    },
    {
      Icon: CheckCircle,
      label: 'Data Verified',
      value: '95%',
      iconColor: 'text-teal-600',
      iconBg: 'from-teal-50 to-cyan-50',
      glowColor: 'group-hover:shadow-teal-100',
      imageUrl: verifiedIllustration,
      imageAlt: 'Data review and analytics dashboard',
    },
    {
      Icon: Calendar,
      label: 'Updated',
      value: 'November 2025',
      iconColor: 'text-amber-600',
      iconBg: 'from-amber-50 to-orange-50',
      glowColor: 'group-hover:shadow-amber-100',
      imageUrl: updatedIllustration,
      imageAlt: 'Calendar and planning notebook',
    },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 mb-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.Icon;
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-6 text-center hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg ${stat.glowColor}`}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative mb-5">
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-200 bg-slate-50">
                      <img
                        src={stat.imageUrl}
                        alt={stat.imageAlt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-12 rounded-b-lg bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    <div className={`absolute left-3 top-3 w-10 h-10 rounded-xl border border-white/80 bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-sm`}>
                      <IconComponent size={20} className={stat.iconColor} />
                    </div>
                  </div>

                  <div className="text-3xl font-medium text-black mb-2 tracking-tight leading-none">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">{stat.label}</div>
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

