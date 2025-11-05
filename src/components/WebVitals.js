'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV === 'production') {
      // Function to handle web vitals reporting
      const reportWebVitals = (metric) => {
        console.log(metric);
        
        // Send to analytics if available
        if (window.gtag) {
          window.gtag('event', metric.name, {
            value: Math.round(metric.value),
            event_label: metric.id,
            non_interaction: true, // Avoids affecting bounce rate
          });
        }
      };

      // Register web vitals
      onCLS(reportWebVitals);
      onFID(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    }
  }, []);

  return null; // This component doesn't render anything
}

export default WebVitals;