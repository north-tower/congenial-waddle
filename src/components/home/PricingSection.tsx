import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface PricingFeature {
  text: string;
}

interface PricingTier {
  name: string;
  price: string;
  pricePeriod?: string;
  description?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
  badge?: string;
}

const PricingSection: React.FC = () => {
  const tiers: PricingTier[] = [
    {
      name: 'STARTER',
      price: '$99',
      pricePeriod: '/month',
      features: [
        { text: '3 users' },
        { text: 'Unlimited comparisons' },
        { text: 'All retailers & countries' },
        { text: 'Basic export (CSV)' },
        { text: 'Email support' },
      ],
      ctaText: 'Start Free Trial',
      ctaLink: '/register',
    },
    {
      name: 'PROFESSIONAL',
      price: '$299',
      pricePeriod: '/month',
      isPopular: true,
      badge: 'Most Popular',
      features: [
        { text: '10 users' },
        { text: 'Everything in Starter' },
        { text: 'PDF & Excel export' },
        { text: 'Priority support' },
        { text: 'API access' },
        { text: 'Historical data' },
      ],
      ctaText: 'Start Free Trial',
      ctaLink: '/register',
    },
    {
      name: 'ENTERPRISE',
      price: 'Custom',
      pricePeriod: 'Pricing',
      features: [
        { text: 'Unlimited users' },
        { text: 'Everything in Professional' },
        { text: 'White-label option' },
        { text: 'Custom data feeds' },
        { text: 'Dedicated support' },
        { text: 'SLA guarantee' },
      ],
      ctaText: 'Contact Sales',
      ctaLink: '/register',
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Centered Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white border ${
                tier.isPopular
                  ? 'border-black shadow-lg scale-105 md:scale-110 z-10'
                  : 'border-gray-200'
              } p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col`}
            >
              {/* Popular Badge */}
              {tier.isPopular && tier.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-4 py-1 text-xs font-medium tracking-wider uppercase">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-medium text-black mb-4 tracking-tight">
                {tier.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-light text-black tracking-tight">
                    {tier.price}
                  </span>
                  {tier.pricePeriod && (
                    <span className="text-gray-600 text-sm">
                      {tier.pricePeriod}
                    </span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check
                      size={20}
                      className={`flex-shrink-0 mt-0.5 ${
                        tier.isPopular ? 'text-black' : 'text-gray-600'
                      }`}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                to={tier.ctaLink}
                className={`inline-block text-center px-6 py-3 text-sm font-medium tracking-wider transition-colors rounded-sm ${
                  tier.isPopular
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                }`}
              >
                {tier.ctaText}
              </Link>
            </div>
          ))}
        </div>

        {/* Subtext */}
        <div className="text-center">
          <p className="text-gray-600 text-sm md:text-base">
            All plans include 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

