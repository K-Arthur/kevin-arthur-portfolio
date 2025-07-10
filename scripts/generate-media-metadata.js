#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { getPlaiceholder } = require('plaiceholder');

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
const getBasicMediaType = (filename) => {
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
  
  return MEDIA_TYPES.IMAGE;
};

const categorizeImageAsset = (dimensions, filename, category, projectType = null) => {
  const { width, height } = dimensions;
  const aspectRatio = width / height;
  const isPortrait = aspectRatio < 1;
  const isLandscape = aspectRatio > 1.5;
  
  if (category === ASSET_CATEGORIES.UIUX) {
    if (projectType === 'mobile-app') {
      return MEDIA_TYPES.MOBILE_MOCKUP;
    }
    
    if (projectType === 'web-app' || projectType === 'website') {
      return MEDIA_TYPES.DESKTOP_MOCKUP;
    }
    
    // Mobile mockup detection
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
    
    // Desktop mockup detection
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
    
    return MEDIA_TYPES.MOBILE_MOCKUP;
  }
  
  return MEDIA_TYPES.GRAPHIC;
};

const getThumbnailConfig = (mediaType, dimensions) => {
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
      const aspectRatio = width / height;
      if (aspectRatio > 1.5) {
        return {
          width: 400,
          height: 250,
          fit: 'cover',
          position: 'center',
          quality: 90,
          aspectRatio: '8/5'
        };
      } else if (aspectRatio < 0.8) {
        return {
          width: 300,
          height: 400,
          fit: 'cover',
          position: 'center',
          quality: 90,
          aspectRatio: '3/4'
        };
      } else {
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

const getAllFiles = (dirPath, arrayOfFiles = []) => {
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    files.forEach(file => {
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  } catch (error) {
    console.warn('Error reading directory:', dirPath, error);
    return arrayOfFiles;
  }
};

const getImageDimensions = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown'
    };
  } catch (error) {
    console.warn('Could not get image dimensions for:', imagePath, error.message);
    return { width: 0, height: 0, format: 'unknown' };
  }
};

const generateBlurPlaceholder = async (imagePath) => {
  try {
    const buffer = fs.readFileSync(imagePath);
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (error) {
    console.warn('Could not generate blur placeholder for:', imagePath, error.message);
    return null;
  }
};

const getVideoMetadata = async (videoPath) => {
  try {
    const stats = fs.statSync(videoPath);
    return {
      size: stats.size,
      format: path.extname(videoPath).substring(1).toLowerCase()
    };
  } catch (error) {
    console.warn('Could not get video metadata for:', videoPath, error.message);
    return { size: 0, format: 'unknown' };
  }
};

const findBestThumbnail = (files, preferredThumbnail = null) => {
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(
      path.extname(file).toLowerCase()
    )
  );

  if (imageFiles.length === 0) return null;

  // If preferred thumbnail is specified, look for it
  if (preferredThumbnail) {
    const preferred = imageFiles.find(file => 
      path.basename(file, path.extname(file)) === path.basename(preferredThumbnail, path.extname(preferredThumbnail))
    );
    if (preferred) return preferred;
  }

  // Fallback priority order
  const priorities = [
    /^(hero|main|cover|thumbnail|preview)/i,
    /^(home|landing|dashboard|interface)/i,
    /^(app|screen|mockup)/i,
    /^(brand|logo|identity)/i,
    /\.(jpg|jpeg)$/i,
    /\.(png)$/i
  ];

  for (const priority of priorities) {
    const match = imageFiles.find(file => {
      const fileName = path.basename(file, path.extname(file));
      return priority.test(fileName) || priority.test(file);
    });
    if (match) return match;
  }

  return imageFiles[0];
};

// Main processing function
const processProject = async (slug, config, projectsRoot) => {
  console.log(`Processing project: ${slug}`);
  
  const categoryPath = path.join(projectsRoot, config.category);
  
  if (!fs.existsSync(categoryPath)) {
    console.warn(`Category path does not exist: ${categoryPath}`);
    return null;
  }

  let project = {
    slug,
    title: config.title,
    category: config.category.replace(/-/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
    description: config.description,
    tags: config.tags,
    type: config.type,
    groupedMedia: {},
    thumbnail: null,
    mediaCount: 0,
    hasVideos: false
  };

  // Handle individual project
  if (config.folder) {
    const projectPath = path.join(categoryPath, config.folder);
    
    if (!fs.existsSync(projectPath)) {
      console.warn(`Project path does not exist: ${projectPath}`);
      return null;
    }

    const allFiles = getAllFiles(projectPath);
    const mediaItems = [];
    
    // Sort files for better ordering
    const sortedFiles = allFiles.sort((a, b) => {
      const aName = path.basename(a, path.extname(a)).toLowerCase();
      const bName = path.basename(b, path.extname(b)).toLowerCase();
      
      if (config.preferredThumbnail) {
        const preferredBase = path.basename(config.preferredThumbnail, path.extname(config.preferredThumbnail)).toLowerCase();
        if (aName === preferredBase) return -1;
        if (bName === preferredBase) return 1;
      }
      
      const priorities = ['hero', 'main', 'cover', 'thumbnail', 'home', 'landing', 'dashboard', 'interface'];
      const aIndex = priorities.findIndex(p => aName.includes(p));
      const bIndex = priorities.findIndex(p => bName.includes(p));
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      return aName.localeCompare(bName);
    });
    
    for (const filePath of sortedFiles) {
      const ext = path.extname(filePath).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.mp4', '.mov', '.avi', '.webm', '.pdf'].includes(ext)) {
        continue;
      }
      
      const filename = path.basename(filePath);
      const relativePath = path.relative(categoryPath, filePath);
      const publicPath = `/images/work/${config.category}/${relativePath.replace(/\\/g, '/')}`;
      
      const basicType = getBasicMediaType(filename);
      let detailedType = basicType;
      let metadata = {};
      let blurPlaceholder = null;
      
      if (basicType === MEDIA_TYPES.IMAGE) {
        const dimensions = await getImageDimensions(filePath);
        
        if (config.type === 'mobile-app') {
          detailedType = MEDIA_TYPES.MOBILE_MOCKUP;
        } else if (config.type === 'web-app' || config.type === 'website') {
          detailedType = MEDIA_TYPES.DESKTOP_MOCKUP;
        } else {
          detailedType = categorizeImageAsset(dimensions, filename, config.category, config.type);
        }
        
        metadata = {
          ...dimensions,
          thumbnailConfig: getThumbnailConfig(detailedType, dimensions)
        };
        
        // Generate blur placeholder
        blurPlaceholder = await generateBlurPlaceholder(filePath);
      } else if (basicType === MEDIA_TYPES.VIDEO) {
        metadata = await getVideoMetadata(filePath);
        project.hasVideos = true;
      }
      
      const mediaItem = {
        src: publicPath,
        type: detailedType,
        title: filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' '),
        alt: `${detailedType.replace('_', ' ')} - ${filename}`,
        metadata,
        blurPlaceholder
      };
      
      mediaItems.push(mediaItem);
    }
    
    if (mediaItems.length > 0) {
      project.groupedMedia[config.title] = mediaItems;
      project.mediaCount = mediaItems.length;
      
      // Set thumbnail from first media item or best thumbnail
      const bestThumbnail = findBestThumbnail(allFiles, config.preferredThumbnail);
      if (bestThumbnail) {
        const relativePath = path.relative(categoryPath, bestThumbnail);
        project.thumbnail = `/images/work/${config.category}/${relativePath.replace(/\\/g, '/')}`;
      } else if (mediaItems.length > 0) {
        project.thumbnail = mediaItems[0].src;
      }
    }
    
    return project;
  }

  // Handle category requests (Video & Motion Graphics)
  if (config.category === ASSET_CATEGORIES.VIDEO) {
    const allFiles = getAllFiles(categoryPath);
    const videoFiles = allFiles.filter(filePath => 
      ['.mp4', '.mov', '.avi', '.webm', '.m4v'].includes(path.extname(filePath).toLowerCase())
    );
    
    const videoGroups = {};
    const allVideosGroup = [];
    
    for (const videoFile of videoFiles) {
      const relativePath = path.relative(categoryPath, videoFile);
      const folder = path.dirname(relativePath);
      const folderName = folder === '.' ? 'Root' : folder;
      
      if (!videoGroups[folderName]) {
        videoGroups[folderName] = [];
      }
      
      const videoMetadata = await getVideoMetadata(videoFile);
      const publicPath = `/images/work/${config.category}/${relativePath.replace(/\\/g, '/')}`;
      
      const baseName = path.basename(videoFile, path.extname(videoFile));
      const thumbnailFile = allFiles.find(f => {
        const fExt = path.extname(f).toLowerCase();
        const fBase = path.basename(f, fExt);
        return fBase === baseName && ['.jpg', '.jpeg', '.png', '.webp'].includes(fExt);
      });
      
      let thumbnail = null;
      if (thumbnailFile) {
        const thumbnailRelativePath = path.relative(categoryPath, thumbnailFile);
        thumbnail = `/images/work/${config.category}/${thumbnailRelativePath.replace(/\\/g, '/')}`;
      }
      
      const videoItem = {
        src: publicPath,
        type: MEDIA_TYPES.VIDEO,
        title: baseName.replace(/-/g, ' ').replace(/_/g, ' '),
        thumbnail: thumbnail,
        metadata: {
          ...videoMetadata,
          category: folderName,
          projectFolder: folderName
        }
      };
      
      videoGroups[folderName].push(videoItem);
      allVideosGroup.push(videoItem);
    }
    
    if (allVideosGroup.length > 0) {
      project.groupedMedia = { 'All Videos': allVideosGroup, ...videoGroups };
      project.mediaCount = videoFiles.length;
      project.hasVideos = true;
      
      // Set thumbnail from first video thumbnail
      const firstVideoWithThumbnail = allVideosGroup.find(v => v.thumbnail);
      if (firstVideoWithThumbnail) {
        project.thumbnail = firstVideoWithThumbnail.thumbnail;
      }
    } else {
      project.groupedMedia = videoGroups;
    }
    
    project.totalVideos = videoFiles.length;
    project.projects = Object.keys(videoGroups).length;
    
    return project;
  }
  
  return project;
};

// Main execution
const main = async () => {
  console.log('🚀 Starting media metadata generation...');
  
  const projectsRoot = path.join(__dirname, '../public/images/work');
  const outputPath = path.join(__dirname, '../src/data/media-metadata.json');
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const metadata = {
    generated: new Date().toISOString(),
    projects: {},
    categories: {}
  };
  
  console.log('📁 Processing projects...');
  
  // Process all projects
  for (const [slug, config] of Object.entries(PROJECT_CONFIG)) {
    try {
      const project = await processProject(slug, config, projectsRoot);
      if (project) {
        metadata.projects[slug] = project;
        
        // Group by category for main work page
        const categoryKey = config.category;
        if (!metadata.categories[categoryKey]) {
          metadata.categories[categoryKey] = [];
        }
        
        metadata.categories[categoryKey].push({
          slug,
          title: config.title,
          category: project.category,
          description: config.description,
          tags: config.tags,
          thumbnail: project.thumbnail || '/images/placeholder.png',
          mediaCount: project.mediaCount,
          hasVideos: project.hasVideos,
          type: config.type
        });
      }
    } catch (error) {
      console.error(`❌ Error processing project ${slug}:`, error);
    }
  }
  
  // Write metadata to file
  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
  
  console.log(`✅ Generated metadata for ${Object.keys(metadata.projects).length} projects`);
  console.log(`📄 Metadata saved to: ${outputPath}`);
  console.log('🎉 Media metadata generation complete!');
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main }; 