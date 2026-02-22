// Cloudinary utility functions for video thumbnails

export const generateVideoThumbnail = (publicId, options = {}) => {
  const {
    width = 350,
    height = 350,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    cloudName = 'dov1tv077'
  } = options;

  // For video thumbnails, we need to use the video URL with image transformations
  // Cloudinary automatically generates thumbnails from the first frame of videos
  return `https://res.cloudinary.com/${cloudName}/video/upload/c_${crop},f_${format},h_${height},q_${quality},w_${width}/${publicId}.jpg`;
};

export const generateImageThumbnail = (publicId, options = {}) => {
  const {
    width = 350,
    height = 350,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    cloudName = 'dov1tv077'
  } = options;

  return `https://res.cloudinary.com/${cloudName}/image/upload/c_${crop},f_${format},h_${height},q_${quality},w_${width}/${publicId}`;
};

export const getThumbnailUrl = (item) => {
  if (!item || !item.publicId) return '/images/placeholder.png';
  
  // If it's a video (mp4 format), generate video thumbnail
  if (item.format === 'mp4') {
    return generateVideoThumbnail(item.publicId);
  }
  
  // For all other media, use existing thumbnailUrl but clean up problematic parameters
  if (item.thumbnailUrl) {
    // Remove the ?_a= parameter that might be causing CORS or loading issues
    return item.thumbnailUrl.split('?')[0];
  }
  
  // Fallback to generating a new thumbnail
  return generateImageThumbnail(item.publicId);
}; 