'use client';

/**
 * MdxLazy
 *
 * Lazily loads the heavy interactive case-study components (three.js explorers,
 * charts, games, framer-motion demos) so their JavaScript is code-split into
 * async chunks and only fetched/mounted when they scroll near the viewport.
 *
 * This keeps three.js / recharts / framer-motion bundles off the initial
 * critical path, which is the single biggest win for LCP, TBT, TTI and
 * "minimize main-thread work" on the case-study pages.
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

function ViewportGate({ minHeight = 360, children }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      // Mount well before the element is visible so there is no layout shift
      // or loading flash by the time the user scrolls to it.
      { rootMargin: '1000px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (show) return <div ref={ref}>{children}</div>;

  return (
    <div
      ref={ref}
      style={{ minHeight }}
      className="w-full rounded-xl bg-muted/30 animate-pulse"
      aria-hidden="true"
    />
  );
}

function lazy(importer, minHeight = 360) {
  const Comp = dynamic(importer, {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-xl bg-muted/30 animate-pulse"
        style={{ minHeight }}
        aria-hidden="true"
      />
    ),
  });

  return function LazyWrapper(props) {
    return (
      <ViewportGate minHeight={minHeight}>
        <Comp {...props} />
      </ViewportGate>
    );
  };
}

export const ResultsHighlight = lazy(() => import('./ResultsHighlight'), 160);
export const ReadabilityChart = lazy(() => import('./case-studies/minohealth/ReadabilityChart'), 360);
export const PaperToggle = lazy(() => import('./case-studies/minohealth/PaperToggle'), 420);
export const ImageComparison = lazy(() => import('./case-studies/minohealth/ImageComparison'), 480);
export const AccuracyGraph = lazy(() => import('./case-studies/moremi/AccuracyGraph'), 360);
export const ConfidenceSimulator = lazy(() => import('./case-studies/moremi/ConfidenceSimulator'), 480);
export const HeatmapToggle = lazy(() => import('./case-studies/moremi/HeatmapToggle'), 420);
export const EfficiencyCalculator = lazy(() => import('./case-studies/moremi-collaborate/EfficiencyCalculator'), 480);
export const WorkflowDemo = lazy(() => import('./case-studies/moremi-collaborate/WorkflowDemo'), 520);
export const SmartComments = lazy(() => import('./case-studies/moremi-collaborate/SmartComments'), 420);
export const BounceRateCounter = lazy(() => import('./case-studies/snackbox/BounceRateCounter'), 320);
export const CandyFace = lazy(() => import('./case-studies/snackbox/CandyFace'), 360);
export const Interactive404Game = lazy(() => import('./case-studies/snackbox/Interactive404Game'), 480);
export const GlitchGallery = lazy(() => import('./case-studies/game-ui/GlitchGallery'), 420);
export const ColorPaletteExplorer = lazy(() => import('./case-studies/game-ui/ColorPaletteExplorer'), 420);
export const DesignPrincipleCards = lazy(() => import('./case-studies/game-ui/DesignPrincipleCards'), 320);
export const ComparisonSlider = lazy(() => import('./case-studies/game-ui/ComparisonSlider'), 420);
export const CaseStudySummary = lazy(() => import('./case-studies/CaseStudySummary'), 280);
export const PrincipleCallout = lazy(() => import('./case-studies/PrincipleCallout'), 200);
export const StalenessSimulator = lazy(() => import('./case-studies/opencode/StalenessSimulator'), 420);
export const ModelSwitcher = lazy(() => import('./case-studies/opencode/ModelSwitcher'), 360);
export const DiffReviewDemo = lazy(() => import('./case-studies/opencode/DiffReviewDemo'), 520);
export const TestWall = lazy(() => import('./case-studies/opencode/TestWall'), 480);
export const ArchitectureExplorer = lazy(() => import('./case-studies/opencode/ArchitectureExplorer'), 520);
export const RenderPipelineExplorer = lazy(() => import('./case-studies/varve/RenderPipelineExplorer'), 560);
export const DocumentModelExplorer = lazy(() => import('./case-studies/varve/DocumentModelExplorer'), 480);
export const DisciplineSwitcher = lazy(() => import('./case-studies/varve/DisciplineSwitcher'), 360);
export const MonorepoStats = lazy(() => import('./case-studies/varve/MonorepoStats'), 420);
export const ProjectTimeline = lazy(() => import('./case-studies/varve/ProjectTimeline'), 360);
export const FailureExplorer = lazy(() => import('./case-studies/varve/FailureExplorer'), 520);
export const DecisionStory = lazy(() => import('./case-studies/DecisionStory'), 200);
