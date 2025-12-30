import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, ShieldCheck, CreditCard, XCircle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface TrustBadge {
  Icon: React.ComponentType<LucideProps>;
  label: string;
}

const FinalCTASection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const trustBadges: TrustBadge[] = [
    { Icon: Lock, label: 'SSL Secured' },
    { Icon: ShieldCheck, label: 'GDPR Compliant' },
    { Icon: CreditCard, label: 'No Credit Card Required' },
    { Icon: XCircle, label: 'Cancel Anytime' },
  ];

  return (
    <section className="bg-black text-white py-20 md:py-24">
      <div className="container mx-auto px-4 text-center">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight max-w-4xl mx-auto">
          Stop Wasting Hours on Manual Research
        </h2>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 500+ logistics professionals who compare delivery prices in seconds, not hours.
        </p>

        {/* CTA Button */}
        <div className="mb-8">
          <Link
            to={isAuthenticated ? "/comparison" : "/register"}
            className="inline-block bg-white text-black px-10 py-5 md:px-12 md:py-6 text-lg md:text-xl font-medium tracking-wider hover:scale-105 transition-transform duration-200 rounded-sm"
          >
            Start Your Free Trial Today
          </Link>
        </div>

        {/* Secondary Text */}
        <p className="text-gray-400 text-sm md:text-base mb-12">
          No credit card required. 14-day free trial. Cancel anytime.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {trustBadges.map((badge, index) => {
            const IconComponent = badge.Icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <IconComponent size={20} className="flex-shrink-0" />
                <span className="text-sm md:text-base">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;

