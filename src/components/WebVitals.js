'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/performance';

export function WebVitals() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV === 'production') {
      initWebVitals();
    }
  }, []);

  return null; // This component doesn't render anything
}

export default WebVitals;