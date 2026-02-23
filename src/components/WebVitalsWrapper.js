'use client';

import dynamic from 'next/dynamic';

const WebVitals = dynamic(() => import('@/components/WebVitals'), {
  ssr: false,
});

export default function WebVitalsWrapper() {
  return <WebVitals />;
}
