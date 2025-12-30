import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRetailers } from '../../hooks/useRetailers';
import { useCountries } from '../../hooks/useCountries';
import { CheckCircle, Globe, TrendingUp, Play } from 'lucide-react';

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

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="aspect-square md:aspect-[4/3] lg:aspect-square">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&q=80"
                alt="Retailer delivery comparison dashboard"
                className="w-full h-full object-cover rounded-sm border border-gray-200"
                loading="eager"
              />
            </div>
            {/* Optional overlay or decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500 opacity-10 rounded-full -z-10"></div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

