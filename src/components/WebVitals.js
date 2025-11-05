'use client';

import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

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
      getCLS(reportWebVitals);
      getFID(reportWebVitals);
      getFCP(reportWebVitals);
      getLCP(reportWebVitals);
      getTTFB(reportWebVitals);
    }
  }, []);

  return null; // This component doesn't render anything
}

export default WebVitals;