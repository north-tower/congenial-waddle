import React from 'react';

interface PainPointCard {
  imageUrl: string;
  imageAlt: string;
  headline: string;
  description: string;
}

const ProblemStatementSection: React.FC = () => {
  const painPoints: PainPointCard[] = [
    {
      imageUrl: 'https://i.postimg.cc/769PZC4w/hours-of-manual-research99.png',
      imageAlt: 'Hours of manual research',
      headline: 'Hours of Manual Research',
      description: 'Visiting 30+ retailer websites across multiple countries takes 10-20 hours per comparison. Your time is worth more.',
    },
    {
      imageUrl: 'https://i.postimg.cc/0Qn5y6vx/inconsistent-data99.png',
      imageAlt: 'Inconsistent data',
      headline: 'Inconsistent Data',
      description: 'Delivery costs vary by country, method, and threshold. Tracking it all in spreadsheets is messy and error-prone.',
    },
    {
      imageUrl: 'https://i.postimg.cc/NMBft63s/no-competitive99.png',
      imageAlt: 'No competitive intelligence',
      headline: 'No Competitive Intelligence',
      description: "Without benchmarking data, you can't optimize your shipping strategy or negotiate better carrier rates.",
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
          {painPoints.map((painPoint, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
            >
              {/* Image */}
              <div className="mb-6">
                <img
                  src={painPoint.imageUrl}
                  alt={painPoint.imageAlt}
                  className="w-12 h-12 object-contain"
                />
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
