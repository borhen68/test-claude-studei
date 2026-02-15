export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Page view tracking
export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// Event tracking
export function event({ 
  action, 
  category, 
  label, 
  value 
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// E-commerce tracking
export function trackPurchase({
  transactionId,
  value,
  currency = 'USD',
  items,
}: {
  transactionId: string;
  value: number;
  currency?: string;
  items: Array<{
    id: string;
    name: string;
    category?: string;
    price: number;
    quantity: number;
  }>;
}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }
}

// Custom conversion events
export const trackEvent = {
  bookCreated: () => {
    event({
      action: 'book_created',
      category: 'engagement',
      label: 'Photo Book Created',
    });
  },
  
  checkoutStarted: (value: number) => {
    event({
      action: 'begin_checkout',
      category: 'ecommerce',
      label: 'Checkout Started',
      value,
    });
  },
  
  photosUploaded: (count: number) => {
    event({
      action: 'photos_uploaded',
      category: 'engagement',
      label: 'Photos Uploaded',
      value: count,
    });
  },
  
  customizationOpened: () => {
    event({
      action: 'customization_opened',
      category: 'engagement',
      label: 'Customization Panel Opened',
    });
  },
  
  themeSelected: (theme: string) => {
    event({
      action: 'theme_selected',
      category: 'engagement',
      label: theme,
    });
  },
  
  addToCart: (productName: string, value: number) => {
    event({
      action: 'add_to_cart',
      category: 'ecommerce',
      label: productName,
      value,
    });
  },
};

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}
