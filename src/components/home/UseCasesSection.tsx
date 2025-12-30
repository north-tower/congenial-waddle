import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, BarChart3, Users } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface PersonaCard {
  Icon: React.ComponentType<LucideProps>;
  iconColor: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const UseCasesSection: React.FC = () => {
  const personas: PersonaCard[] = [
    {
      Icon: Briefcase,
      iconColor: 'text-blue-600',
      title: 'E-commerce Manager',
      description: 'Benchmark your delivery costs against competitors. Optimize shipping strategy. Reduce customer complaints about high delivery fees.',
      ctaText: 'Compare Your Rates',
      ctaLink: '/comparison',
    },
    {
      Icon: BarChart3,
      iconColor: 'text-green-600',
      title: 'Retail Analyst',
      description: 'Generate competitive intelligence reports. Track delivery pricing trends. Present data-driven recommendations to stakeholders.',
      ctaText: 'Start Analysis',
      ctaLink: '/comparison',
    },
    {
      Icon: Users,
      iconColor: 'text-purple-600',
      title: 'Supply Chain Consultant',
      description: 'Provide clients with instant delivery cost benchmarks. Identify savings opportunities. Justify carrier negotiations with data.',
      ctaText: 'Get Consultant Access',
      ctaLink: '/register',
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Centered Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Built for Logistics Professionals
          </h2>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {personas.map((persona, index) => {
            const IconComponent = persona.Icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {/* Icon */}
                <div className="mb-6">
                  <IconComponent size={48} className={persona.iconColor} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-black mb-4 tracking-tight">
                  {persona.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed text-sm mb-6 flex-grow">
                  {persona.description}
                </p>

                {/* CTA Button */}
                <Link
                  to={persona.ctaLink}
                  className="inline-block bg-black text-white px-6 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors rounded-sm text-center"
                >
                  {persona.ctaText}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;

