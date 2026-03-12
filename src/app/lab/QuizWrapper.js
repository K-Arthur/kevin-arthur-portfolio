'use client';

import dynamic from 'next/dynamic';

export const AIReadinessQuiz = dynamic(
  () => import('@/components/AIReadinessQuiz'),
  {
    ssr: false,
    loading: () => <div className="w-[100%] h-[400px] animate-pulse bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">Initializing AI Lab Environment...</div>
  }
);

export default AIReadinessQuiz;
