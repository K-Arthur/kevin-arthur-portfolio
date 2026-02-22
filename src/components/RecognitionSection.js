'use client';

import dynamic from 'next/dynamic';
import { recognition } from '@/data/portfolio-data';
import { cn } from '@/lib/utils';

const AnimatedCounter = dynamic(
  () => import('@/components/ui/AnimatedCounter').then(mod => mod.default),
  { ssr: false, loading: () => <span>0</span> }
);

export default function RecognitionSection({ className = '' }) {
  const mediaItems = recognition.filter(r => r.type === 'media' || r.type === 'award');
  const impactItems = recognition.filter(r => r.type === 'impact');

  return (
    <section className={cn('py-8 sm:py-10 md:py-14', className)}>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
        Recognition & Impact
      </h2>
      <p className="text-muted-foreground text-center mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base px-2">
        Recognition and impact across product design and technology.
      </p>

      {/* Media / Award badges */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
        {mediaItems.map((item, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-card/50 border border-primary/20 text-foreground text-sm sm:text-base"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-primary shrink-0">
              Featured
            </span>
            <span className="font-bold truncate max-w-[120px] sm:max-w-none">{item.name}</span>
            <span className="text-muted-foreground hidden sm:inline text-sm">— {item.context}</span>
          </div>
        ))}
      </div>

      {/* Impact metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {impactItems.map((item, index) => (
          <div
            key={index}
            className="card-enhanced p-4 sm:p-6 bg-card/30 rounded-2xl border border-border backdrop-blur-sm text-center group hover:border-primary/20 transition-all duration-300"
          >
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
              <AnimatedCounter value={item.value} />
            </div>
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.context}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
