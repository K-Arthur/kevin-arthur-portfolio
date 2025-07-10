#!/usr/bin/env node

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Import project configuration
const projectConfigPath = path.join(__dirname, '../src/lib/projectConfig.js');
const { PROJECT_CONFIG } = require(projectConfigPath);

const MEDIA_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
  PDF: 'pdf',
  DESKTOP_MOCKUP: 'desktop_mockup',
  MOBILE_MOCKUP: 'mobile_mockup',
  GRAPHIC: 'graphic'
};

const ASSET_CATEGORIES = {
  UIUX: 'UI-UX-Design',
  GRAPHICS: 'Graphic-Design-Branding',
  VIDEO: 'Video-Motion-Graphics'
};

// Helper functions
const getBasicMediaType = (public_id) => {
  const format = public_id.split('.').pop()?.toLowerCase();
  
  if (['mp4', 'mov', 'avi', 'webm', 'm4v'].includes(format)) {
    return MEDIA_TYPES.VIDEO;
  }
  
  if (['pdf'].includes(format)) {
    return MEDIA_TYPES.PDF;
  }
  
  return MEDIA_TYPES.IMAGE;
};

const categorizeImageAsset = (resource, category, projectType = null) => {
  const { width, height, public_id } = resource;
  const aspectRatio = width / height;
  const isPortrait = aspectRatio < 1;
  const isLandscape = aspectRatio > 1.5;
  const filename = public_id.split('/').pop();
  
  if (category === ASSET_CATEGORIES.UIUX) {
    if (projectType === 'mobile-app') return MEDIA_TYPES.MOBILE_MOCKUP;
    if (projectType === 'web-app' || projectType === 'website') return MEDIA_TYPES.DESKTOP_MOCKUP;
    
    if (isPortrait && (
      filename.toLowerCase().includes('mobile') ||
      (aspectRatio >= 0.4 && aspectRatio <= 0.7)
    )) {
      return MEDIA_TYPES.MOBILE_MOCKUP;
    }
    
    if (isLandscape || (
      filename.toLowerCase().includes('desktop') ||
      (aspectRatio >= 1.3 && aspectRatio <= 2.0)
    )) {
      return MEDIA_TYPES.DESKTOP_MOCKUP;
    }
    
    return MEDIA_TYPES.MOBILE_MOCKUP;
  }
  
  return MEDIA_TYPES.GRAPHIC;
};

const getThumbnailUrl = (publicId, mediaType, dimensions) => {
  const transformations = {
    [MEDIA_TYPES.MOBILE_MOCKUP]: { width: 250, height: 400, crop: 'fill', gravity: 'north' },
    [MEDIA_TYPES.DESKTOP_MOCKUP]: { width: 500, height: 350, crop: 'fill', gravity: 'north' },
    [MEDIA_TYPES.VIDEO]: { width: 500, height: 280, crop: 'fill', gravity: 'center' },
    [MEDIA_TYPES.GRAPHIC]: (dims) => {
      const aspectRatio = dims.width / dims.height;
      if (aspectRatio > 1.5) return { width: 400, height: 250, crop: 'fill' };
      if (aspectRatio < 0.8) return { width: 300, height: 400, crop: 'fill' };
      return { width: 350, height: 350, crop: 'fill' };
    },
    default: { width: 350, height: 350, crop: 'fill' },
  };

  let transform = transformations[mediaType] || transformations.default;
  if (typeof transform === 'function') {
    transform = transform(dimensions);
  }

  return cloudinary.url(publicId, {
    transformation: [{ ...transform, quality: 'auto', fetch_format: 'auto' }],
  });
};

const fetchCloudinaryResources = async (folder) => {
  try {
    const { resources } = await cloudinary.search
      .expression(`folder:"${folder}"`)
      .with_field('tags')
      .with_field('context')
      .max_results(500)
      .execute();
    return resources;
  } catch (error) {
    console.error(`Error fetching resources from Cloudinary folder "${folder}":`, error);
    return [];
  }
};

const getBlurPlaceholder = (publicId, width, height) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 100, crop: 'scale' },
      { effect: 'blur:1000', quality: 1 }
    ]
  });
};

const processProject = async (slug, config) => {
  console.log(`\nProcessing project: ${config.title}`);

  const cloudinaryBaseFolder = process.env.CLOUDINARY_BASE_FOLDER;
  const projectFolder = config.folder || config.title; // Use folder property, fallback to title
  const cloudinaryFolder = [cloudinaryBaseFolder, config.category, projectFolder].filter(Boolean).join('/');
  const resources = await fetchCloudinaryResources(cloudinaryFolder);
  
  if (resources.length === 0) {
    console.warn(`No media assets found in Cloudinary folder: ${cloudinaryFolder}`);
    return null;
  }

  let media = resources.map(resource => {
    const basicType = getBasicMediaType(resource.public_id);
    const mediaType = basicType === 'image'
      ? categorizeImageAsset(resource, config.category, config.projectType)
      : basicType;

    const thumbnailUrl = getThumbnailUrl(resource.public_id, mediaType, { width: resource.width, height: resource.height });
    const blurPlaceholder = getBlurPlaceholder(resource.public_id, resource.width, resource.height);

    return {
      id: resource.asset_id,
      publicId: resource.public_id,
      title: resource.context?.title || path.basename(resource.public_id, path.extname(resource.public_id)),
      description: resource.context?.description || '',
      url: resource.secure_url,
      mediaType: mediaType,
      category: config.category,
      tags: resource.tags || [],
      width: resource.width,
      height: resource.height,
      aspectRatio: resource.width / resource.height,
      format: resource.format,
      thumbnailUrl,
      blurPlaceholder,
    };
  });

  const heroAsset = config.hero
    ? media.find(m => m.publicId.includes(config.hero)) || media[0]
    : media[0];

  return {
    ...config,
    slug,
    media,
    heroAsset,
  };
};

const main = async () => {
  console.log('Starting media metadata generation from Cloudinary...');
  let allMediaData = {};

  for (const [slug, config] of Object.entries(PROJECT_CONFIG)) {
    const projectData = await processProject(slug, config);
    if (projectData) {
      allMediaData[slug] = projectData;
    }
  }

  const outputPath = path.join(__dirname, '../src/data/media-metadata.json');
  try {
    fs.writeFileSync(outputPath, JSON.stringify(allMediaData, null, 2));
    console.log(`\nSuccessfully generated media metadata at: ${outputPath}`);
  } catch (error) {
    console.error('Error writing media metadata file:', error);
  }
  
  console.log('Finished generating media metadata.');
};

main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
}); 