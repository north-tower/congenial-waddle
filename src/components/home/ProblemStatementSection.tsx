import React from 'react';
import { Clock, DollarSign, TrendingUp } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface PainPointCard {
  Icon: React.ComponentType<LucideProps>;
  iconColor: string;
  headline: string;
  description: string;
}

const ProblemStatementSection: React.FC = () => {
  const painPoints: PainPointCard[] = [
    {
      Icon: Clock,
      iconColor: 'text-blue-600',
      headline: 'Hours of Manual Research',
      description: 'Visiting 30+ retailer websites across multiple countries takes 10-20 hours per comparison. Your time is worth more.',
    },
    {
      Icon: DollarSign,
      iconColor: 'text-red-600',
      headline: 'Inconsistent Data',
      description: 'Delivery costs vary by country, method, and threshold. Tracking it all in spreadsheets is messy and error-prone.',
    },
    {
      Icon: TrendingUp,
      iconColor: 'text-green-600',
      headline: 'No Competitive Intelligence',
      description: 'Without benchmarking data, you can\'t optimize your shipping strategy or negotiate better carrier rates.',
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Centered Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Tired of Manual Delivery Price Research?
          </h2>
        </div>

        {/* Three-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {painPoints.map((painPoint, index) => {
            const IconComponent = painPoint.Icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
              >
                {/* Icon */}
                <div className="mb-6">
                  <IconComponent size={48} className={painPoint.iconColor} />
                </div>

                {/* Headline */}
                <h3 className="text-xl font-medium text-black mb-4 tracking-tight">
                  {painPoint.headline}
                </h3>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed text-sm">
                  {painPoint.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;

