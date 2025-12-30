import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Globe, Zap, BarChart3 } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface FeatureCard {
  Icon: React.ComponentType<LucideProps>;
  iconColor: string;
  borderColor: string;
  headline: string;
  description: string;
}

const SolutionOverviewSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after first intersection to prevent re-triggering
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -100px 0px', // Start animation slightly before element is fully visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, []);

  const features: FeatureCard[] = [
    {
      Icon: Search,
      iconColor: 'text-blue-600',
      borderColor: 'border-l-blue-500',
      headline: 'Smart Retailer Search',
      description: 'Type any retailer name. Get instant autocomplete from our database of 30+ verified retailers.',
    },
    {
      Icon: Globe,
      iconColor: 'text-green-600',
      borderColor: 'border-l-green-500',
      headline: 'Multi-Country Coverage',
      description: 'Compare delivery costs across Austria, Denmark, Sweden, Ireland, Norway, Switzerland, New Zealand, UAE, Israel, UK, and more.',
    },
    {
      Icon: Zap,
      iconColor: 'text-yellow-600',
      borderColor: 'border-l-yellow-500',
      headline: 'Instant Comparison',
      description: 'Select up to 10 retailers. Choose a country. Get results sorted by best price in under 3 seconds.',
    },
    {
      Icon: BarChart3,
      iconColor: 'text-purple-600',
      borderColor: 'border-l-purple-500',
      headline: 'Detailed Breakdown',
      description: 'See standard vs express, free shipping thresholds, carriers, delivery times, and special notes for each retailer.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-white py-20"
    >
      <div className="container mx-auto px-4">
        {/* Centered Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            One Platform. All Delivery Prices. Instant Insights.
          </h2>
        </div>

        {/* Feature Grid - 2x2 */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12 transition-opacity duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.Icon;
            return (
              <div
                key={index}
                className={`bg-white border-l-4 ${feature.borderColor} border-t border-r border-b border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default`}
              >
                {/* Icon */}
                <div className="mb-6">
                  <IconComponent size={40} className={feature.iconColor} />
                </div>

                {/* Headline */}
                <h3 className="text-xl font-medium text-black mb-4 tracking-tight">
                  {feature.headline}
                </h3>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            to={isAuthenticated ? "/comparison" : "/register"}
            className={`inline-block bg-black text-white px-10 py-4 text-base font-medium tracking-wider hover:bg-gray-800 transition-all duration-200 rounded-sm transition-opacity duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Try It Now - No Credit Card Required
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionOverviewSection;

