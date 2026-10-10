import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Export the report function
export function reportWebVitals(metric) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(metric.name, {
      props: {
        value: Math.round(metric.value),
        id: metric.id,
      },
    });
  }
}

// Export the setup function for manual initialization
export function initWebVitals() {
  if (typeof window !== 'undefined') {
    onCLS(reportWebVitals);
    onINP(reportWebVitals); // INP replaced FID in web-vitals v3+
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
  }
}