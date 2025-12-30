import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How is your data collected and verified?',
      answer:
        'We manually research delivery information from official retailer websites across 10+ countries. All data is timestamped and marked as verified, partial, or requires verification. We update our database monthly and alert users to changes.',
    },
    {
      question: 'Can I upload my own delivery data?',
      answer:
        'Yes! Professional and Enterprise plans include CSV upload functionality. You can supplement our database with your proprietary data for custom comparisons.',
    },
    {
      question: 'Which countries and retailers do you cover?',
      answer:
        'We currently cover 10+ countries (Austria, Denmark, Sweden, Ireland, Norway, Switzerland, New Zealand, UAE, Israel, UK) and 30+ major retailers including ASOS, Zara, Nike, H&M, Lululemon, Gymshark, and more. See our full coverage list.',
    },
    {
      question: 'How often is the data updated?',
      answer:
        'Our core database is updated monthly. Professional and Enterprise customers receive weekly updates and can request priority verification for specific retailers.',
    },
    {
      question: 'Can I export comparison results?',
      answer:
        'Yes! All paid plans include export functionality. Starter includes CSV export. Professional and Enterprise include PDF and Excel exports with custom branding options.',
    },
    {
      question: 'Do you offer API access?',
      answer:
        'Yes! Professional and Enterprise plans include REST API access for programmatic queries. Perfect for integrating into your existing systems or building custom dashboards.',
    },
    {
      question: 'What if I need data for a country or retailer you don\'t have?',
      answer:
        'Enterprise customers can request custom data collection. We\'ll research and verify delivery information for any retailer or country within 5-7 business days.',
    },
    {
      question: 'Is there a free trial?',
      answer:
        'Yes! All paid plans include a 14-day free trial with full access to features. No credit card required to start.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Centered Headline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion - Two columns on desktop, single on mobile */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 overflow-hidden"
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-base font-medium text-black pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-black flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Answer - Animated */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-6 pt-0">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

