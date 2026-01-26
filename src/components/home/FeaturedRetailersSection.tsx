import React from 'react';
import asosLogo from '../../assets/asos-1.svg';
import zaraLogo from '../../assets/zara.svg';
import hmLogo from '../../assets/h-m.svg';
import nikeLogo from '../../assets/nike-8.svg';
import lululemonLogo from '../../assets/lululemon-1.svg';
import gymsharkLogo from '../../assets/gymshark.svg';
import asicsLogo from '../../assets/asics-6.svg';
import mangoLogo from '../../assets/mango-4.svg';
import allsaintsLogo from '../../assets/allsaints.svg';
import clarksLogo from '../../assets/clarks.svg';
import nextLogo from '../../assets/next-1.svg';
import riverIslandLogo from '../../assets/river-island.svg';
import msLogo from '../../assets/m-s-2.svg';
import sportsDirectLogo from '../../assets/sports-direct.svg';
import sheinLogo from '../../assets/shein-1.svg';
import tkMaxxLogo from '../../assets/tk-maxx-1.svg';
import zalandoLogo from '../../assets/zalando-2.svg';

const FeaturedRetailersSection: React.FC = () => {
  // Retailer data with domain names for logo URLs
  const retailers = [
    { name: 'ASOS', domain: 'asos.com', logo: asosLogo },
    { name: 'Zara', domain: 'zara.com', logo: zaraLogo },
    { name: 'H&M', domain: 'hm.com', logo: hmLogo },
    { name: 'Nike', domain: 'nike.com', logo: nikeLogo },
    { name: 'Uniqlo', domain: 'uniqlo.com' },
    { name: 'Lululemon', domain: 'lululemon.com', logo: lululemonLogo },
    { name: 'Gymshark', domain: 'gymshark.com', logo: gymsharkLogo },
    { name: 'ASICS', domain: 'asics.com', logo: asicsLogo },
    { name: 'Mango', domain: 'mango.com', logo: mangoLogo },
    { name: 'Boohoo', domain: 'boohoo.com' },
    { name: 'All Saints', domain: 'allsaints.com', logo: allsaintsLogo },
    { name: 'Clarks', domain: 'clarks.com', logo: clarksLogo },
    { name: 'COS', domain: 'cos.com' },
    { name: 'Next', domain: 'next.co.uk', logo: nextLogo },
    { name: 'River Island', domain: 'riverisland.com', logo: riverIslandLogo },
    { name: 'M&S', domain: 'marksandspencer.com', logo: msLogo },
    { name: 'Sports Direct', domain: 'sportsdirect.com', logo: sportsDirectLogo },
    { name: 'Shein', domain: 'shein.com', logo: sheinLogo },
    { name: 'TK Maxx', domain: 'tkmaxx.com', logo: tkMaxxLogo },
    { name: 'Zalando', domain: 'zalando.co.uk', logo: zalandoLogo },
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
                  src={retailer.logo || `https://logo.clearbit.com/${retailer.domain}`}
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

