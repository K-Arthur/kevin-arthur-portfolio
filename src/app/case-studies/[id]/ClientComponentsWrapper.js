'use client';

import dynamic from 'next/dynamic';

// Dynamically import client-only components
const DottedGlowBackground = dynamic(
  () => import('@/components/ui/dotted-glow-background').then(mod => mod.DottedGlowBackground),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-secondary/3" /> }
);

const CaseStudyLightbox = dynamic(
  () => import('./CaseStudyLightbox'),
  { ssr: false }
);

const ReadingProgress = dynamic(
  () => import('@/components/ui/ReadingProgress'),
  { ssr: false }
);

export function DottedGlowBackgroundWrapper(props) {
  return <DottedGlowBackground {...props} />;
}

export function CaseStudyLightboxWrapper() {
  return <CaseStudyLightbox />;
}

export function ReadingProgressWrapper() {
  return <ReadingProgress />;
}
