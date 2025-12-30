import React from 'react';

const FeaturedRetailersSection: React.FC = () => {
  // Retailer data with domain names for logo URLs
  const retailers = [
    { name: 'ASOS', domain: 'asos.com' },
    { name: 'Zara', domain: 'zara.com' },
    { name: 'H&M', domain: 'hm.com' },
    { name: 'Nike', domain: 'nike.com' },
    { name: 'Uniqlo', domain: 'uniqlo.com' },
    { name: 'Lululemon', domain: 'lululemon.com' },
    { name: 'Gymshark', domain: 'gymshark.com' },
    { name: 'ASICS', domain: 'asics.com' },
    { name: 'Mango', domain: 'mango.com' },
    { name: 'Boohoo', domain: 'boohoo.com' },
    { name: 'All Saints', domain: 'allsaints.com' },
    { name: 'Clarks', domain: 'clarks.com' },
    { name: 'COS', domain: 'cos.com' },
    { name: 'Next', domain: 'next.co.uk' },
    { name: 'River Island', domain: 'riverisland.com' },
    { name: 'M&S', domain: 'marksandspencer.com' },
    { name: 'Sports Direct', domain: 'sportsdirect.com' },
    { name: 'Shein', domain: 'shein.com' },
    { name: 'TK Maxx', domain: 'tkmaxx.com' },
    { name: 'Zalando', domain: 'zalando.co.uk' },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Centered Headline */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Trusted Data from 30+ Leading Retailers
          </h2>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto mb-8">
          {retailers.map((retailer, index) => (
            <div
              key={index}
              className="flex items-center justify-center"
            >
              {/* Logo container - grayscale by default, color on hover */}
              <div className="w-24 h-24 flex items-center justify-center group">
                <img
                  src={`https://logo.clearbit.com/${retailer.domain}`}
                  alt={`${retailer.name} logo`}
                  className="w-full h-full object-contain p-3 grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Subtext */}
        <div className="text-center">
          <p className="text-gray-600 text-sm md:text-base">
            ...and more retailers added monthly
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRetailersSection;

