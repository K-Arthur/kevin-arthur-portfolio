/**
 * Icon Utility for Tree Shaking
 *
 * This file re-exports individual icons from react-icons/fa to enable
 * better tree shaking and reduce bundle size.
 *
 * Usage:
 *   import { FaLinkedin, FaBehanceSquare } from '@/lib/icons';
 *
 * Instead of:
 *   import { FaLinkedin, FaBehanceSquare } from 'react-icons/fa';
 *
 * This approach ensures only the specific icons you import are included
 * in the bundle, rather than the entire react-icons/fa package.
 */

// Re-export individual icons for better tree shaking
export {
  FaArrowRight,
  FaLinkedin,
  FaBehanceSquare,
  FaRocket,
  FaFlask,
  FaEnvelope,
  FaCalendarAlt,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaLock,
  FaClipboardCheck,
  FaBrain,
  FaCheck,
  FaSpinner,
  FaRedo,
  FaTrophy,
  FaBolt,
  FaStar,
  FaCheckDouble,
  FaFire,
  FaHandshake,
  FaSun,
  FaMoon,
  FaDownload,
  FaArrowUp,
  FaArrowLeft,
  FaExclamationTriangle,
  FaTimesCircle,
  FaShare,
  FaTwitter,
  FaMinus,
  FaPaperPlane,
  FaBriefcase,
} from 'react-icons/fa';
