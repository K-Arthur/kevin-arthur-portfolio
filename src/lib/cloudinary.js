/**
 * Cloudinary Image Optimization Utility
 * 
 * Provides functions to optimize Cloudinary image URLs with:
 * - Automatic format selection (WebP, AVIF)
 * - Automatic quality optimization
 * - Responsive sizing
 * - DPR (device pixel ratio) support
 */

/**
 * Parses a Cloudinary URL to extract the base components
 * @param {string} url - The Cloudinary URL
 * @returns {object|null} - Parsed components or null if not a valid Cloudinary URL
 */
export function parseCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return null;

  // Match Cloudinary URL pattern
  const match = url.match(
    /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)(?:\/v\d+)?\/(.+)$/
  );

  if (!match) return null;

  return {
    baseUrl: match[1],
    version: url.match(/\/v(\d+)\//)?.[1] || null,
    publicId: match[2],
  };
}

/**
 * Optimizes a Cloudinary image URL with transformation parameters
 * 
 * @param {string} url - The original Cloudinary URL
 * @param {object} options - Optimization options
 * @param {number} options.width - Target width (optional)
 * @param {number} options.height - Target height (optional)
 * @param {string} options.quality - Quality setting ('auto', 'auto:best', 'auto:good', 'auto:eco', 'auto:low', or 1-100)
 * @param {string} options.format - Format ('auto', 'webp', 'avif', 'jpg', 'png')
 * @param {string} options.crop - Crop mode ('fill', 'fit', 'limit', 'scale', 'thumb')
 * @param {number} options.dpr - Device pixel ratio (1-3)
 * @param {boolean} options.progressive - Use progressive JPEG loading
 * @returns {string} - Optimized URL or original if not a Cloudinary URL
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;

  // Skip if not a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) return url;

  // Skip if already has transformation parameters
  if (url.includes('/image/upload/') &&
    url.match(/\/image\/upload\/[^/]+\//) &&
    !url.match(/\/image\/upload\/v\d+\//)) {
    // Already has transformations, but let's check if we need to update
    return url;
  }

  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
    dpr,
    progressive = true,
  } = options;

  // Build transformation string
  const transformations = [];

  // Add format optimization (f_auto for WebP/AVIF)
  if (format) {
    transformations.push(`f_${format}`);
  }

  // Add quality optimization
  if (quality) {
    transformations.push(`q_${quality}`);
  }

  // Add dimensions with crop mode
  if (width || height) {
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
  }

  // Add DPR for high-density displays
  if (dpr) {
    transformations.push(`dpr_${dpr}`);
  }

  // Add progressive loading
  if (progressive && (format === 'jpg' || format === 'auto')) {
    transformations.push('fl_progressive');
  }

  // Build the optimized URL
  const transformString = transformations.join(',');
  const versionPath = parsed.version ? `/v${parsed.version}/` : '/';

  return `${parsed.baseUrl}/${transformString}${versionPath}${parsed.publicId}`;
}

/**
 * Generates a srcSet for responsive images
 * 
 * @param {string} url - The original Cloudinary URL
 * @param {number[]} widths - Array of widths to generate
 * @param {object} options - Additional options (excluding width)
 * @returns {string} - SrcSet string
 */
export function generateCloudinarySrcSet(url, widths = [640, 750, 828, 1080, 1200, 1920], options = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return '';

  return widths
    .map(width => {
      const optimizedUrl = optimizeCloudinaryUrl(url, { ...options, width });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Default sizes attribute for common layouts
 */
export const DEFAULT_SIZES = {
  fullWidth: '100vw',
  halfWidth: '(max-width: 768px) 100vw, 50vw',
  thirdWidth: '(max-width: 768px) 100vw, 33vw',
  twoThirds: '(max-width: 768px) 100vw, 67vw',
  threeFifths: '(max-width: 768px) 100vw, 60vw',
  featured: '(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 55vw',
  caseStudy: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px',
};

/**
 * Predefined optimization presets for common use cases
 */
export const CLOUDINARY_PRESETS = {
  // For hero/featured images - high quality, responsive
  featured: {
    quality: 'auto:eco', // Changed from 'auto:good' to save ~30%
    format: 'auto',      // WebP/AVIF
    crop: 'limit',
    widths: [320, 480, 640, 750, 828, 1080, 1200], // Added smaller widths
    defaultWidth: 640,   // Reduced from 800
  },

  // For thumbnails/previews - balanced quality
  thumbnail: {
    quality: 'auto:low', // Changed from 'auto:eco' for more savings
    format: 'auto',
    crop: 'limit',
    widths: [150, 200, 300, 400, 600], // More granular widths
    defaultWidth: 300, // Reduced from 400
  },

  // For logos/icons - small, efficient
  logo: {
    quality: 'auto:low',
    format: 'auto',
    crop: 'limit',
    widths: [100, 150, 200, 300],
    defaultWidth: 150,
  },

  // For gallery images
  gallery: {
    quality: 'auto:eco', // Changed from 'auto:good'
    format: 'auto',
    crop: 'limit',
    widths: [320, 480, 640, 800, 1200],
    defaultWidth: 480,
  },

  // For case study list images - new preset
  caseStudy: {
    quality: 'auto:eco',
    format: 'auto',
    crop: 'fill', // Use fill to match exact dimensions
    widths: [320, 480, 640, 828, 1080],
    defaultWidth: 480,
  },
};

/**
 * Applies a preset and generates optimized URL with srcSet
 * 
 * @param {string} url - Original Cloudinary URL
 * @param {string} presetName - Name of the preset to use
 * @param {object} overrides - Options to override preset values
 * @returns {object} - { url, srcSet, sizes }
 */
export function applyCloudinaryPreset(url, presetName = 'featured', overrides = {}) {
  const preset = CLOUDINARY_PRESETS[presetName] || CLOUDINARY_PRESETS.featured;
  const options = { ...preset, ...overrides };
  const { widths, ...transformOptions } = options;

  // Generate srcSet for responsive images
  const srcSet = generateCloudinarySrcSet(url, widths, transformOptions);

  // Get the default width or the middle-sized URL for the main src
  const width = overrides.width || preset.defaultWidth || widths[Math.floor(widths.length / 2)];
  const optimizedUrl = optimizeCloudinaryUrl(url, {
    ...transformOptions,
    width,
  });

  return {
    url: optimizedUrl,
    srcSet,
    sizes: overrides.sizes || DEFAULT_SIZES[presetName] || DEFAULT_SIZES.fullWidth,
  };
}

export default {
  optimizeCloudinaryUrl,
  generateCloudinarySrcSet,
  parseCloudinaryUrl,
  applyCloudinaryPreset,
  DEFAULT_SIZES,
  CLOUDINARY_PRESETS,
};
