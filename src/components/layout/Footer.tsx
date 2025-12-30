import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  Icon: React.ComponentType<LucideProps>;
  label: string;
  href: string;
}

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns: FooterColumn[] = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
      ],
    },
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'API Documentation', href: '/api-docs' },
        { label: 'Roadmap', href: '/roadmap' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Data Coverage', href: '/coverage' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Industry Reports', href: '/reports' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'GDPR Compliance', href: '/gdpr' },
      ],
    },
  ];

  const socialLinks: SocialLink[] = [
    { Icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/retailer-comparison' },
    { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com/retailercompare' },
    { Icon: Mail, label: 'Email', href: 'mailto:contact@retailercomparison.com' },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    // TODO: Implement newsletter subscription API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      alert('Thank you for subscribing!');
    }, 500);
  };

  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Newsletter Section */}
        <div className="bg-gray-900 border border-gray-800 p-8 mb-12 rounded-sm">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl md:text-2xl font-medium mb-4 tracking-tight">
              Get monthly delivery pricing insights
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 mt-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:border-white rounded-sm text-sm"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black px-8 py-3 font-medium tracking-wider hover:bg-gray-200 transition-colors rounded-sm text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium uppercase tracking-wider mb-4 text-white">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-6">
              {socialLinks.map((social, index) => {
                const IconComponent = social.Icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center md:text-right">
              © 2025 Retailer Comparison Tool. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
