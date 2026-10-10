'use client';

import dynamic from 'next/dynamic';

const InfiniteGridBackground = dynamic(
  () => import('@/components/ui/the-infinite-grid'),
  { ssr: false }
);

/**
 * Decorative grid only — never wrap page copy in this.
 * Keeps /about, /case-studies, and /contact text in the server HTML.
 */
export default function PageBackdrop() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      <InfiniteGridBackground
        className="min-h-screen"
        gridSize={50}
        speedX={0.25}
        speedY={0.2}
        revealRadius={350}
        baseOpacity={0.04}
        revealOpacity={0.45}
        fullPage={true}
      />
    </div>
  );
}
