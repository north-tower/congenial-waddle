import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  initials: string;
  avatarColor: string;
}

const TestimonialsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
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

  const testimonials: Testimonial[] = [
    {
      quote: 'This tool saved us 15+ hours per month on delivery cost research. The data is accurate and always up-to-date. Worth every penny.',
      name: 'Sarah Mitchell',
      title: 'E-commerce Director',
      company: 'FashionHub',
      initials: 'SM',
      avatarColor: 'bg-blue-500',
    },
    {
      quote: 'We used the comparison data to negotiate 12% better rates with our carrier. The ROI was immediate.',
      name: 'James Chen',
      title: 'Supply Chain Manager',
      company: 'GlobalRetail',
      initials: 'JC',
      avatarColor: 'bg-green-500',
    },
    {
      quote: 'As a consultant, this tool makes me look like a hero to my clients. Instant competitive intelligence at my fingertips.',
      name: 'Maria Rodriguez',
      title: 'Retail Logistics Consultant',
      company: 'Independent',
      initials: 'MR',
      avatarColor: 'bg-purple-500',
    },
  ];

  const trustLogos = [
    'Logistics Weekly',
    'Retail Tech News',
    'Supply Chain Today',
    'E-commerce Pro',
  ];

  return (
    <section ref={sectionRef} className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Centered Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Trusted by Logistics Leaders
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 transition-opacity duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 italic leading-relaxed mb-6 flex-grow text-sm">
                "{testimonial.quote}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 ${testimonial.avatarColor} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-sm font-medium">
                    {testimonial.initials}
                  </span>
                </div>

                {/* Name and Company */}
                <div>
                  <div className="text-black font-medium text-sm mb-1">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {testimonial.title}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Logos Section */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-6">As featured in:</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {trustLogos.map((logo, index) => (
              <div
                key={index}
                className="text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

