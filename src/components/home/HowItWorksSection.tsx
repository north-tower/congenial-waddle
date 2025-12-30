import React, { useEffect, useRef, useState } from 'react';
import { Upload, CheckSquare, BarChart3 } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface Step {
  number: number;
  Icon: React.ComponentType<LucideProps>;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
}

const HowItWorksSection: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((stepRef, index) => {
      if (!stepRef) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => new Set([...prev, index]));
            observer.disconnect();
          }
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      observer.observe(stepRef);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const steps: Step[] = [
    {
      number: 1,
      Icon: Upload,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      title: 'Upload Your Data or Use Ours',
      description: 'Start with our pre-loaded database of 366+ verified delivery rates, or upload your own CSV for custom comparisons.',
    },
    {
      number: 2,
      Icon: CheckSquare,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      title: 'Select Retailers & Country',
      description: 'Search and select up to 10 retailers. Choose your target country from our dropdown of 10+ supported regions.',
    },
    {
      number: 3,
      Icon: BarChart3,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      title: 'Compare & Export',
      description: 'View results sorted by best price. See all delivery methods, costs, and thresholds. Export to PDF or Excel for reports.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="demo-section"
      className="bg-gray-50 py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Centered Headline */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
              Get Started in 3 Simple Steps
            </h2>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.Icon;
              const isVisible = visibleSteps.has(index);
              
              return (
                <div
                  key={index}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className={`bg-white border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Step Number and Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-shrink-0">
                      {/* Background Circle */}
                      <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center`}>
                        <IconComponent size={32} className={step.iconColor} />
                      </div>
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-medium text-black mb-4 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
