import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRetailers } from '../hooks/useRetailers';
import HeroSection from '../components/home/HeroSection';
import ProblemStatementSection from '../components/home/ProblemStatementSection';
import SolutionOverviewSection from '../components/home/SolutionOverviewSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import FeaturedRetailersSection from '../components/home/FeaturedRetailersSection';
import DataCoverageSection from '../components/home/DataCoverageSection';
import UseCasesSection from '../components/home/UseCasesSection';
import PricingSection from '../components/home/PricingSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';
import FinalCTASection from '../components/home/FinalCTASection';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { data: retailers = [] } = useRetailers();
  
  // Get featured retailers (first 8)
  const featuredRetailers = retailers.slice(0, 8);
  const popularRetailers = retailers.slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Problem Statement Section */}
      <ProblemStatementSection />

      {/* Solution Overview Section */}
      <SolutionOverviewSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Featured Retailers Section */}
      <FeaturedRetailersSection />

      {/* Data Coverage Section */}
      <DataCoverageSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />



      {/* Final CTA Section */}
      <FinalCTASection />
    </div>
  );
};


