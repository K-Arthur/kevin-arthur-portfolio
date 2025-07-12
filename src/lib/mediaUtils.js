import { promises as fs } from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const MEDIA_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
  PDF: 'pdf',
  DESKTOP_MOCKUP: 'desktop_mockup',
  MOBILE_MOCKUP: 'mobile_mockup',
  GRAPHIC: 'graphic'
};

export const ASSET_CATEGORIES = {
  UIUX: 'UI-UX-Design',
  GRAPHICS: 'Graphic-Design-Branding',
  VIDEO: 'Video-Motion-Graphics'
};

// Detect media type based on file extension
export const getBasicMediaType = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (['mp4', 'mov', 'avi', 'webm', 'm4v'].includes(ext)) {
    return MEDIA_TYPES.VIDEO;
  }
  
  if (['pdf'].includes(ext)) {
    return MEDIA_TYPES.PDF;
  }
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext)) {
    return MEDIA_TYPES.IMAGE;
  }
  
  return MEDIA_TYPES.IMAGE; // Default fallback
};

// Categorize images based on dimensions and context
export const categorizeImageAsset = (dimensions, filename, category, projectType = null) => {
  const { width, height } = dimensions;
  const aspectRatio = width / height;
  const isPortrait = aspectRatio < 1;
  const isLandscape = aspectRatio > 1.5;
  
  // Enhanced UI/UX categorization with project type context
  if (category === ASSET_CATEGORIES.UIUX) {
    // Use project type for more accurate categorization
    if (projectType === 'mobile-app') {
      return MEDIA_TYPES.MOBILE_MOCKUP;
    }
    
    if (projectType === 'web-app' || projectType === 'website') {
      return MEDIA_TYPES.DESKTOP_MOCKUP;
    }
    
    // Fallback to dimension-based detection
    // Mobile mockup detection (more refined)
    if (isPortrait && (
      filename.toLowerCase().includes('mobile') ||
      filename.toLowerCase().includes('phone') ||
      filename.toLowerCase().includes('ios') ||
      filename.toLowerCase().includes('android') ||
      filename.toLowerCase().includes('app') ||
      (width < 600 && height > 800) ||
      (aspectRatio >= 0.4 && aspectRatio <= 0.7)
    )) {
      return MEDIA_TYPES.MOBILE_MOCKUP;
    }
    
    // Desktop mockup detection (more refined)
    if (isLandscape || (
      filename.toLowerCase().includes('desktop') ||
      filename.toLowerCase().includes('web') ||
      filename.toLowerCase().includes('website') ||
      filename.toLowerCase().includes('dashboard') ||
      filename.toLowerCase().includes('interface') ||
      (width > 1000 && height > 600) ||
      (aspectRatio >= 1.3 && aspectRatio <= 2.0)
    )) {
      return MEDIA_TYPES.DESKTOP_MOCKUP;
    }
    
    // Default to mobile mockup for UI/UX if unclear
    return MEDIA_TYPES.MOBILE_MOCKUP;
  }
  
  // Default to graphic for other categories
  return MEDIA_TYPES.GRAPHIC;
};

// Enhanced thumbnail configuration with better aspect ratios
export const getThumbnailConfig = (mediaType, dimensions) => {
  const { width, height } = dimensions;
  
  switch (mediaType) {
    case MEDIA_TYPES.MOBILE_MOCKUP:
      return {
        width: 250,
        height: 400,
        fit: 'cover',
        position: 'top',
        quality: 90,
        aspectRatio: '5/8'
      };
      
    case MEDIA_TYPES.DESKTOP_MOCKUP:
      return {
        width: 500,
        height: 350,
        fit: 'cover',
        position: 'top',
        quality: 90,
        aspectRatio: '16/11'
      };
      
    case MEDIA_TYPES.VIDEO:
      return {
        width: 500,
        height: 280,
        fit: 'cover',
        position: 'center',
        quality: 85,
        aspectRatio: '16/9'
      };
      
    case MEDIA_TYPES.GRAPHIC:
      // Dynamic aspect ratio based on original dimensions
      const aspectRatio = width / height;
      if (aspectRatio > 1.5) {
        // Wide graphics (logos, banners)
        return {
          width: 400,
          height: 250,
          fit: 'cover',
          position: 'center',
          quality: 90,
          aspectRatio: '8/5'
        };
      } else if (aspectRatio < 0.8) {
        // Tall graphics (posters, cards)
        return {
          width: 300,
          height: 400,
          fit: 'cover',
          position: 'center',
          quality: 90,
          aspectRatio: '3/4'
        };
      } else {
        // Square-ish graphics
        return {
          width: 350,
          height: 350,
          fit: 'cover',
          position: 'center',
          quality: 90,
          aspectRatio: '1/1'
        };
      }
      
    default:
      return {
        width: 350,
        height: 350,
        fit: 'cover',
        position: 'center',
        quality: 85,
        aspectRatio: '1/1'
      };
  }
};

// Check if metadata file is stale (older than X minutes)
export const isMetadataStale = async (maxAgeMinutes = 30) => {
  try {
    const metadataPath = path.join(process.cwd(), 'src', 'data', 'media-metadata.json');
    const stats = await fs.stat(metadataPath);
    const fileAge = Date.now() - stats.mtime.getTime();
    const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds
    
    return fileAge > maxAge;
  } catch (error) {
    console.error('Error checking metadata staleness:', error);
    return true; // Assume stale if we can't check
  }
};

// Get fresh project data from Cloudinary
export const getFreshProjectData = async (slug, config) => {
  try {
    const cloudinaryBaseFolder = process.env.CLOUDINARY_BASE_FOLDER;
    const projectFolder = config.folder || config.title;
    const cloudinaryFolder = [cloudinaryBaseFolder, config.category, projectFolder].filter(Boolean).join('/');
    
    const { resources } = await cloudinary.v2.search
      .expression(`folder:"${cloudinaryFolder}"`)
      .with_field('tags')
      .with_field('context')
      .max_results(500)
      .execute();
    
    if (resources.length === 0) {
      return null;
    }
    
    const media = resources.map(resource => ({
      id: resource.asset_id,
      publicId: resource.public_id,
      title: resource.context?.title || path.basename(resource.public_id, path.extname(resource.public_id)),
      description: resource.context?.description || '',
      url: resource.secure_url,
      mediaType: getMediaType(resource),
      category: config.category,
      tags: resource.tags || [],
      width: resource.width,
      height: resource.height,
      aspectRatio: resource.width / resource.height,
      format: resource.format,
      thumbnailUrl: getThumbnailUrl(resource.public_id, getMediaType(resource), resource),
      blurPlaceholder: getBlurPlaceholder(resource.public_id)
    }));
    
    const heroAsset = config.hero
      ? media.find(m => m.publicId.includes(config.hero)) || media[0]
      : media[0];
    
    return {
      ...config,
      slug,
      media,
      heroAsset,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error fetching fresh project data:', error);
    return null;
  }
};

// Helper functions
const getMediaType = (resource) => {
  const format = resource.format?.toLowerCase();
  
  if (['mp4', 'mov', 'avi', 'webm', 'm4v'].includes(format)) {
    return MEDIA_TYPES.VIDEO;
  }
  
  if (['pdf'].includes(format)) {
    return MEDIA_TYPES.PDF;
  }
  
  // For images, categorize based on dimensions and context
  const aspectRatio = resource.width / resource.height;
  if (aspectRatio < 1 && resource.width < 800) {
    return MEDIA_TYPES.MOBILE_MOCKUP;
  } else if (aspectRatio > 1.3 && resource.width > 1000) {
    return MEDIA_TYPES.DESKTOP_MOCKUP;
  }
  
  return MEDIA_TYPES.GRAPHIC;
};

const getThumbnailUrl = (publicId, mediaType, resource) => {
  const transformations = {
    [MEDIA_TYPES.MOBILE_MOCKUP]: { width: 250, height: 400, crop: 'fill', gravity: 'north' },
    [MEDIA_TYPES.DESKTOP_MOCKUP]: { width: 500, height: 350, crop: 'fill', gravity: 'north' },
    [MEDIA_TYPES.VIDEO]: { width: 500, height: 280, crop: 'fill', gravity: 'center' },
    [MEDIA_TYPES.GRAPHIC]: { width: 350, height: 350, crop: 'fill' },
    default: { width: 350, height: 350, crop: 'fill' }
  };
  
  const transform = transformations[mediaType] || transformations.default;
  
  if (mediaType === MEDIA_TYPES.VIDEO) {
    return cloudinary.v2.url(publicId, {
      resource_type: 'video',
      transformation: [{ ...transform, quality: 'auto' }],
      format: 'jpg',
    });
  }
  
  return cloudinary.v2.url(publicId, {
    transformation: [{ ...transform, quality: 'auto', fetch_format: 'auto' }],
  });
};

const getBlurPlaceholder = (publicId) => {
  return cloudinary.v2.url(publicId, {
    transformation: [
      { width: 100, crop: 'scale' },
      { effect: 'blur:1000', quality: 1 }
    ]
  });
};

// Get optimal grid layout based on media types in collection
export const getOptimalGridLayout = (mediaItems) => {
  const typeCounts = mediaItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});
  
  const totalItems = mediaItems.length;
  const hasMobile = typeCounts[MEDIA_TYPES.MOBILE_MOCKUP] > 0;
  const hasDesktop = typeCounts[MEDIA_TYPES.DESKTOP_MOCKUP] > 0;
  const hasVideos = typeCounts[MEDIA_TYPES.VIDEO] > 0;
  
  // Mobile mockup focused layout
  if (hasMobile && typeCounts[MEDIA_TYPES.MOBILE_MOCKUP] / totalItems > 0.6) {
    return {
      columns: { mobile: 2, tablet: 3, desktop: 4 },
      aspectRatio: '9/16',
      spacing: 'md',
      layout: 'mobile-focus'
    };
  }
  
  // Desktop mockup focused layout
  if (hasDesktop && typeCounts[MEDIA_TYPES.DESKTOP_MOCKUP] / totalItems > 0.6) {
    return {
      columns: { mobile: 1, tablet: 2, desktop: 3 },
      aspectRatio: '4/3',
      spacing: 'lg',
      layout: 'desktop-focus'
    };
  }
  
  // Video focused layout
  if (hasVideos && typeCounts[MEDIA_TYPES.VIDEO] / totalItems > 0.6) {
    return {
      columns: { mobile: 1, tablet: 1, desktop: 2 },
      aspectRatio: '16/9',
      spacing: 'lg',
      layout: 'video-focus'
    };
  }
  
  // Mixed content layout
  return {
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    aspectRatio: 'auto',
    spacing: 'md',
    layout: 'mixed'
  };
};

// ARIA labels for different media types
export const getARIALabels = (mediaType, index, total, title) => {
  const baseTitle = title || `Media item ${index + 1}`;
  
  switch (mediaType) {
    case MEDIA_TYPES.MOBILE_MOCKUP:
      return {
        label: `Mobile mockup: ${baseTitle}`,
        description: `Mobile interface design ${index + 1} of ${total}`,
        role: 'img'
      };
      
    case MEDIA_TYPES.DESKTOP_MOCKUP:
      return {
        label: `Desktop mockup: ${baseTitle}`,
        description: `Desktop interface design ${index + 1} of ${total}`,
        role: 'img'
      };
      
    case MEDIA_TYPES.VIDEO:
      return {
        label: `Video: ${baseTitle}`,
        description: `Video content ${index + 1} of ${total}`,
        role: 'application'
      };
      
    default:
      return {
        label: `Graphic: ${baseTitle}`,
        description: `Graphic design ${index + 1} of ${total}`,
        role: 'img'
      };
  }
}; 