import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Upload,
  Search,
  BarChart3,
  FileText,
  Globe,
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRetailers } from '../hooks/useRetailers';
import { useCountries } from '../hooks/useCountries';
import { analytics } from '../utils/analytics';

export const Guide: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { data: retailers = [] } = useRetailers();
  const { data: countries = [] } = useCountries();

  useEffect(() => {
    analytics.trackGuideView();
  }, []);

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Create Your Account',
      description:
        'Sign up for a free account to get started. No credit card required. You can start comparing retailers immediately after registration.',
      action: isAuthenticated ? null : 'Sign Up Now',
      actionLink: '/register',
    },
    {
      number: 2,
      icon: Search,
      title: 'Select Retailers',
      description:
        'Search and select up to 10 retailers you want to compare. Use our search to find specific retailers or browse our complete list.',
      action: 'Browse Retailers',
      actionLink: '/retailers',
    },
    {
      number: 3,
      icon: Globe,
      title: 'Choose Your Country',
      description:
        'Select the destination country for your delivery comparison. We support 10+ countries with verified delivery rate data.',
    },
    {
      number: 4,
      icon: BarChart3,
      title: 'View Comparison Results',
      description:
        'See all delivery options sorted by price. Compare delivery methods, costs, and thresholds side-by-side. Export results to PDF or Excel.',
      action: isAuthenticated ? 'Start Comparison' : null,
      actionLink: isAuthenticated ? '/comparison' : null,
    },
  ];

  const features = [
    {
      icon: Package,
      title: 'Comprehensive Database',
      description: `Access ${retailers.length > 0 ? retailers.length : '30+'}+ verified retailers with ${retailers.length > 0 ? '366+' : '300+'} delivery rates across ${countries.length > 0 ? countries.length : '10'}+ countries.`,
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Comparisons',
      description: 'Get instant side-by-side comparisons of shipping costs, delivery times, and service options from multiple retailers.',
    },
    {
      icon: FileText,
      title: 'Export & Share',
      description: 'Download your comparison results as PDF or Excel files. Perfect for reports, presentations, and team collaboration.',
    },
    {
      icon: Shield,
      title: 'Verified Data',
      description: 'All delivery rates are verified and regularly updated. Trust the data you use to make critical business decisions.',
    },
    {
      icon: Zap,
      title: 'Fast & Easy',
      description: 'Compare up to 10 retailers in seconds. No need to visit multiple websites or spend hours researching.',
    },
    {
      icon: Users,
      title: 'History & Tracking',
      description: 'Save your comparisons and access them anytime. Track changes over time and build your own comparison library.',
    },
  ];

  const tips = [
    {
      title: 'Compare Multiple Retailers',
      description: 'Select up to 10 retailers to get a comprehensive view of the market. This helps you identify the best deals.',
    },
    {
      title: 'Check Different Countries',
      description: 'Compare the same retailers across different countries to understand regional pricing variations.',
    },
    {
      title: 'Review All Delivery Options',
      description: 'Each retailer may offer multiple delivery methods. Compare standard, express, and premium options.',
    },
    {
      title: 'Export Your Results',
      description: 'Save your comparisons for future reference or share them with your team using the export feature.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center">
                <FileText size={32} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
              User Guide
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about using ShipCompare to find the best delivery rates and make informed logistics decisions.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-black mb-8 tracking-tight">
              What is ShipCompare?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                ShipCompare is a powerful tool designed to help businesses and individuals compare delivery rates and shipping options from multiple retailers across different countries. Instead of visiting dozens of websites and manually comparing prices, ShipCompare brings all this information together in one place.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our platform provides access to verified delivery rate data from {retailers.length > 0 ? retailers.length : '30+'}+ major retailers, covering {countries.length > 0 ? countries.length : '10'}+ countries. Whether you're a logistics manager, e-commerce business owner, or simply looking for the best shipping deal, ShipCompare makes it easy to find what you need.
              </p>
              <div className="bg-white border border-gray-200 p-6 rounded-sm mt-8">
                <h3 className="text-xl font-medium text-black mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Save hours of research time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Make data-driven decisions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Access verified, up-to-date data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Compare multiple retailers simultaneously</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Export results for reports and analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 tracking-tight text-center">
              How to Use ShipCompare
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Follow these simple steps to start comparing retailers and finding the best delivery rates.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 p-8 rounded-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                          <IconComponent size={28} className="text-black" />
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-xs font-medium text-gray-500">STEP</span>
                          <div className="text-2xl font-light text-black">{step.number}</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-medium text-black mb-3 tracking-tight">
                          {step.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {step.description}
                        </p>
                        {step.action && step.actionLink && (
                          <Link
                            to={step.actionLink}
                            className="inline-flex items-center gap-2 text-black hover:text-gray-700 transition-colors text-sm font-medium"
                          >
                            {step.action}
                            <ArrowRight size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 tracking-tight text-center">
              Platform Features
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Discover what makes ShipCompare the best tool for comparing delivery rates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 p-6 rounded-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <IconComponent size={24} className="text-black" />
                    </div>
                    <h3 className="text-xl font-medium text-black mb-2 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-black mb-4 tracking-tight text-center">
              Tips for Best Results
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Get the most out of ShipCompare with these helpful tips.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 p-6 rounded-sm"
                >
                  <h3 className="text-lg font-medium text-black mb-2 tracking-tight">
                    {tip.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already saving time and money with ShipCompare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-green-500 text-white px-8 py-4 text-base font-medium tracking-wider hover:bg-green-600 transition-colors text-center rounded-sm"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-black border-2 border-white px-8 py-4 text-base font-medium tracking-wider hover:bg-gray-100 transition-colors text-center rounded-sm"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/comparison"
                  className="bg-green-500 text-white px-8 py-4 text-base font-medium tracking-wider hover:bg-green-600 transition-colors text-center rounded-sm"
                >
                  Start Comparing
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

