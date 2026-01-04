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

// Check if metadata file is stale (older than X minutes)
export const isMetadataStale = async (maxAgeMinutes = 30) => {
  try {
    const metadataPath = path.join(process.cwd(), 'src', 'data', 'media-metadata.json');
    const stats = await fs.stat(metadataPath);
    const fileAge = Date.now() - stats.mtime.getTime();
    const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds
    
    return fileAge > maxAge;
  } catch (error) {
    // If file doesn't exist or other error, assume it's stale
    return true; 
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
      thumbnailUrl: getThumbnailUrl(resource.public_id, getMediaType(resource)),
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
    console.error(`Error fetching fresh project data for ${slug}:`, error);
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
  
  const aspectRatio = resource.width / resource.height;
  if (aspectRatio < 1 && resource.width < 800) {
    return MEDIA_TYPES.MOBILE_MOCKUP;
  } else if (aspectRatio > 1.3 && resource.width > 1000) {
    return MEDIA_TYPES.DESKTOP_MOCKUP;
  }
  
  return MEDIA_TYPES.GRAPHIC;
};

const getThumbnailUrl = (publicId, mediaType) => {
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