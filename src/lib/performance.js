import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

// Export the report function
export function reportWebVitals(metric) {
  console.log(metric);
  
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

// Export the setup function for manual initialization
export function initWebVitals() {
  if (typeof window !== 'undefined') {
    onCLS(reportWebVitals);
    onFID(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
  }
}