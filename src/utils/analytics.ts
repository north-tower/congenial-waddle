/**
 * Analytics utility for tracking user behavior and app usage
 * Supports multiple analytics providers (Google Analytics, custom backend, etc.)
 */

// Analytics event types
export type AnalyticsEvent =
  | 'page_view'
  | 'user_register'
  | 'user_login'
  | 'user_logout'
  | 'comparison_start'
  | 'comparison_complete'
  | 'comparison_export'
  | 'retailer_search'
  | 'retailer_select'
  | 'retailer_view'
  | 'country_select'
  | 'export_pdf'
  | 'export_excel'
  | 'history_view'
  | 'history_item_view'
  | 'guide_view'
  | 'feature_click'
  | 'error_occurred';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

// Configuration
interface AnalyticsConfig {
  enabled: boolean;
  googleAnalyticsId?: string;
  backendEndpoint?: string;
  debug?: boolean;
}

// Get config from environment variables
const getConfig = (): AnalyticsConfig => {
  return {
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED !== 'false',
    googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID,
    backendEndpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics',
    debug: import.meta.env.DEV,
  };
};

const config = getConfig();

// Google Analytics helper functions
const initGoogleAnalytics = () => {
  if (!config.googleAnalyticsId || typeof window === 'undefined') return;

  // Load gtag script if not already loaded
  if (!window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', config.googleAnalyticsId, {
      page_path: window.location.pathname,
    });
  }
};

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Send event to Google Analytics
const trackGoogleAnalytics = (event: AnalyticsEvent, properties?: Record<string, any>) => {
  if (!config.googleAnalyticsId || !window.gtag) return;

  try {
    window.gtag('event', event, {
      ...properties,
      event_category: 'engagement',
      event_label: properties?.label || event,
    });
  } catch (error) {
    if (config.debug) {
      console.error('Google Analytics tracking error:', error);
    }
  }
};

// Send event to backend
const trackBackend = async (event: AnalyticsEvent, properties?: Record<string, any>) => {
  if (!config.backendEndpoint) return;

  try {
    const userId = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') || '{}').id
      : undefined;

    const eventData: AnalyticsEventData = {
      event,
      properties,
      userId,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(config.backendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok && config.debug) {
      console.warn('Analytics backend tracking failed:', response.statusText);
    }
  } catch (error) {
    // Silently fail - analytics should not break the app
    if (config.debug) {
      console.error('Backend analytics tracking error:', error);
    }
  }
};

// Main tracking function
export const trackEvent = (
  event: AnalyticsEvent,
  properties?: Record<string, any>
): void => {
  if (!config.enabled) return;

  if (config.debug) {
    console.log('[Analytics]', event, properties);
  }

  // Track in Google Analytics
  if (config.googleAnalyticsId) {
    trackGoogleAnalytics(event, properties);
  }

  // Track in backend
  if (config.backendEndpoint) {
    trackBackend(event, properties).catch(() => {
      // Silently fail
    });
  }
};

// Track page views
export const trackPageView = (path: string, title?: string): void => {
  if (!config.enabled) return;

  trackEvent('page_view', {
    path,
    title: title || document.title,
  });

  // Update Google Analytics page view
  if (config.googleAnalyticsId && window.gtag) {
    window.gtag('config', config.googleAnalyticsId, {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

// Initialize analytics on app load
export const initAnalytics = (): void => {
  if (!config.enabled) return;

  if (config.googleAnalyticsId) {
    initGoogleAnalytics();
  }

  // Track initial page view
  trackPageView(window.location.pathname, document.title);
};

// Convenience functions for common events
export const analytics = {
  // User events
  trackRegister: (email: string) => {
    trackEvent('user_register', { email });
  },
  trackLogin: (email: string) => {
    trackEvent('user_login', { email });
  },
  trackLogout: () => {
    trackEvent('user_logout');
  },

  // Comparison events
  trackComparisonStart: (retailerCount: number) => {
    trackEvent('comparison_start', { retailer_count: retailerCount });
  },
  trackComparisonComplete: (data: {
    retailerCount: number;
    country: string;
    resultCount: number;
  }) => {
    trackEvent('comparison_complete', data);
  },
  trackComparisonExport: (format: 'pdf' | 'excel') => {
    trackEvent('comparison_export', { format });
    if (format === 'pdf') {
      trackEvent('export_pdf');
    } else {
      trackEvent('export_excel');
    }
  },

  // Retailer events
  trackRetailerSearch: (query: string, resultCount: number) => {
    trackEvent('retailer_search', { query, result_count: resultCount });
  },
  trackRetailerSelect: (retailerId: string, retailerName: string) => {
    trackEvent('retailer_select', { retailer_id: retailerId, retailer_name: retailerName });
  },
  trackRetailerView: (retailerId: string, retailerName: string) => {
    trackEvent('retailer_view', { retailer_id: retailerId, retailer_name: retailerName });
  },

  // Country events
  trackCountrySelect: (countryId: string, countryName: string) => {
    trackEvent('country_select', { country_id: countryId, country_name: countryName });
  },

  // History events
  trackHistoryView: () => {
    trackEvent('history_view');
  },
  trackHistoryItemView: (comparisonId: string) => {
    trackEvent('history_item_view', { comparison_id: comparisonId });
  },

  // Guide events
  trackGuideView: () => {
    trackEvent('guide_view');
  },

  // Feature events
  trackFeatureClick: (featureName: string, location?: string) => {
    trackEvent('feature_click', { feature_name: featureName, location });
  },

  // Error tracking
  trackError: (error: Error, context?: string) => {
    trackEvent('error_occurred', {
      error_message: error.message,
      error_name: error.name,
      context,
    });
  },
};

