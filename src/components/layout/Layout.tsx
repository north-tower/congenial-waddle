import React from 'react';
import Header from './Header';
import { Footer } from './Footer';
import { AnalyticsTracker } from '../common/AnalyticsTracker';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnalyticsTracker />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};


