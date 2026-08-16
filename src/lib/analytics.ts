/**
 * Google Analytics (GA4) helper for tracking page views, conversion events, and user interactions.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Smile 7 Dental Clinic official GA4 Measurement ID
export const GA_MEASUREMENT_ID = 'G-2SS1H6134C';

/**
 * Track custom user events (e.g. Appointment Bookings, WhatsApp Clicks, Phone Calls)
 */
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track page views dynamically
 */
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};
