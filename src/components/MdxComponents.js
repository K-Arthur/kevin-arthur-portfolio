// MdxComponents - Server-compatible component mappings for MDX content
// Note: The 'img' component is a server component that renders as the ClickableImage client component
//
// Heavy interactive components (three.js, charts, games, framer-motion demos) are
// loaded lazily via MdxLazy so their JavaScript is code-split and only mounted
// when scrolled near the viewport. This keeps them off the initial critical path
// and is the biggest win for LCP / TBT / TTI on the case-study pages.
import { ClickableImage } from './ui/ImageLightbox';
import {
  ResultsHighlight,
  ReadabilityChart,
  PaperToggle,
  ImageComparison,
  AccuracyGraph,
  ConfidenceSimulator,
  HeatmapToggle,
  EfficiencyCalculator,
  WorkflowDemo,
  SmartComments,
  BounceRateCounter,
  CandyFace,
  Interactive404Game,
  GlitchGallery,
  ColorPaletteExplorer,
  DesignPrincipleCards,
  ComparisonSlider,
  CaseStudySummary,
  PrincipleCallout,
  StalenessSimulator,
  ModelSwitcher,
  DiffReviewDemo,
  TestWall,
  ArchitectureExplorer,
  RenderPipelineExplorer,
  DocumentModelExplorer,
  DisciplineSwitcher,
  MonorepoStats,
  ProjectTimeline,
  FailureExplorer,
  DecisionStory,
} from './MdxLazy';

// Custom component to replace the default <img> tag in MDX content
// Using the ClickableImage client component for fullscreen capability
const MdxImage = (props) => (
  <ClickableImage
    src={props.src}
    alt={props.alt || ''}
    width={850}
    height={550}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 850px"
    quality={90}
    {...props}
  />
);

export const mdxComponents = {
  img: MdxImage,
  ResultsHighlight,
  ReadabilityChart,
  PaperToggle,
  ImageComparison,
  AccuracyGraph,
  ConfidenceSimulator,
  HeatmapToggle,
  EfficiencyCalculator,
  WorkflowDemo,
  SmartComments,
  BounceRateCounter,
  CandyFace,
  Interactive404Game,
  GlitchGallery,
  ColorPaletteExplorer,
  DesignPrincipleCards,
  ComparisonSlider,
  CaseStudySummary,
  PrincipleCallout,
  StalenessSimulator,
  ModelSwitcher,
  DiffReviewDemo,
  TestWall,
  ArchitectureExplorer,
  RenderPipelineExplorer,
  DocumentModelExplorer,
  DisciplineSwitcher,
  MonorepoStats,
  ProjectTimeline,
  FailureExplorer,
  DecisionStory,
};