import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRetailers } from '../../hooks/useRetailers';
import { useCountries } from '../../hooks/useCountries';
import { CheckCircle, Globe, TrendingUp, Play, Truck, Clock3, ShieldCheck } from 'lucide-react';
import asosLogo from '../../assets/asos-1.svg';
import zaraLogo from '../../assets/zara.svg';
import nikeLogo from '../../assets/nike-8.svg';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const { isAuthenticated } = useAuth();
  const { data: retailers = [] } = useRetailers();
  const { data: countries = [] } = useCountries();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setIsVisible(true);
  }, []);

  // Featured retailer names for display
  const featuredRetailerNames = retailers.length > 0 
    ? retailers.slice(0, 5).map(r => r.name)
    : ['ASOS', 'Zara', 'Nike', 'H&M', 'Adidas'];

  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroRows = [
    { retailer: 'ASOS', country: 'UK', price: 'GBP 3.95', delta: '-8%' },
    { retailer: 'Zara', country: 'DE', price: 'EUR 4.90', delta: '-5%' },
    { retailer: 'Nike', country: 'US', price: 'USD 6.00', delta: '+2%' },
  ];

  const brandMarks = [
    { src: asosLogo, alt: 'ASOS logo' },
    { src: zaraLogo, alt: 'Zara logo' },
    { src: nikeLogo, alt: 'Nike logo' },
  ];

  return (
    <section className={`bg-white py-12 md:py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div 
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
          {/* Left Column - Content */}
          <div className="text-left">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight leading-tight">
              Compare Retailer Delivery Prices Across{' '}
              <span className="font-medium">{countries.length > 0 ? `${countries.length}+` : '10+'}</span> Countries in Seconds
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl">
              Save hours of research. Make data-driven logistics decisions. Benchmark delivery costs from{' '}
              <span className="font-medium">{retailers.length > 0 ? `${retailers.length}+` : '30+'}</span> major retailers including{' '}
              {featuredRetailerNames.slice(0, 4).join(', ')}
              {featuredRetailerNames.length > 4 && `, and more.`}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to={isAuthenticated ? "/comparison" : "/register"}
                className="bg-green-500 text-white px-8 py-4 text-base font-medium tracking-wider hover:bg-green-600 transition-colors text-center rounded-sm"
              >
                Start Free Comparison
              </Link>
              <button
                onClick={scrollToDemo}
                className="bg-white text-black border-2 border-black px-8 py-4 text-base font-medium tracking-wider hover:bg-black hover:text-white transition-colors text-center rounded-sm flex items-center justify-center gap-2"
              >
                <Play size={20} />
                See How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                <div>
                  <div className="text-xl font-medium text-black">366+ verified delivery rates</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={24} className="text-black flex-shrink-0" />
                <div>
                  <div className="text-xl font-medium text-black">{countries.length > 0 ? countries.length : '10'} countries covered</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp size={24} className="text-black flex-shrink-0" />
                <div>
                  <div className="text-xl font-medium text-black">Updated November 2025</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Visual */}
          <div className="relative">
            <div className="aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-green-50/60 to-gray-100 p-6 shadow-xl">
              <div className="h-full w-full rounded-xl bg-white/90 border border-gray-200 p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm uppercase tracking-wider text-gray-500">Live Benchmark Snapshot</p>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Updated daily</span>
                </div>

                <div className="space-y-3 mb-6">
                  {heroRows.map((row) => (
                    <div key={`${row.retailer}-${row.country}`} className="grid grid-cols-4 items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-sm font-medium text-black">{row.retailer}</span>
                      <span className="text-xs text-gray-600">{row.country}</span>
                      <span className="text-sm font-medium text-black">{row.price}</span>
                      <span className={`text-xs font-medium ${row.delta.startsWith('-') ? 'text-green-600' : 'text-amber-600'}`}>
                        {row.delta}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-auto">
                  {brandMarks.map((brand) => (
                    <div key={brand.alt} className="h-12 rounded-md border border-gray-200 bg-white flex items-center justify-center p-2">
                      <img src={brand.src} alt={brand.alt} className="max-h-6 w-auto object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-10 hidden md:flex items-center gap-2 rounded-lg bg-white border border-gray-200 shadow-md px-3 py-2">
              <Truck size={16} className="text-green-600" />
              <span className="text-xs font-medium text-gray-700">30+ retailers tracked</span>
            </div>
            <div className="absolute -right-5 bottom-24 hidden md:flex items-center gap-2 rounded-lg bg-white border border-gray-200 shadow-md px-3 py-2">
              <Clock3 size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Results in seconds</span>
            </div>
            <div className="absolute right-10 -bottom-5 hidden md:flex items-center gap-2 rounded-lg bg-white border border-gray-200 shadow-md px-3 py-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">Verified data quality</span>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-500/10 rounded-full -z-10"></div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

