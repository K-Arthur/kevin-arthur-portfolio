// MdxComponents - Server-compatible component mappings for MDX content
// Note: The 'img' component is a server component that renders as the ClickableImage client component
import Image from 'next/image';
import ResultsHighlight from './ResultsHighlight';
import ReadabilityChart from './case-studies/minohealth/ReadabilityChart';
import PaperToggle from './case-studies/minohealth/PaperToggle';
import ImageComparison from './case-studies/minohealth/ImageComparison';
import AccuracyGraph from './case-studies/moremi/AccuracyGraph';
import ConfidenceSimulator from './case-studies/moremi/ConfidenceSimulator';
import HeatmapToggle from './case-studies/moremi/HeatmapToggle';
import EfficiencyCalculator from './case-studies/moremi-collaborate/EfficiencyCalculator';
import WorkflowDemo from './case-studies/moremi-collaborate/WorkflowDemo';
import SmartComments from './case-studies/moremi-collaborate/SmartComments';
import BounceRateCounter from './case-studies/snackbox/BounceRateCounter';
import CandyFace from './case-studies/snackbox/CandyFace';
import Interactive404Game from './case-studies/snackbox/Interactive404Game';
import GlitchGallery from './case-studies/game-ui/GlitchGallery';
import ColorPaletteExplorer from './case-studies/game-ui/ColorPaletteExplorer';
import DesignPrincipleCards from './case-studies/game-ui/DesignPrincipleCards';
import ComparisonSlider from './case-studies/game-ui/ComparisonSlider';
import { ClickableImage } from './ui/ImageLightbox';

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
};