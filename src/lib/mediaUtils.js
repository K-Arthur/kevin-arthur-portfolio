// Client-side media utilities

export const MEDIA_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
  PDF: 'pdf',
  DESKTOP_MOCKUP: 'desktop_mockup',
  MOBILE_MOCKUP: 'mobile_mockup',
  GRAPHIC: 'graphic'
};

// Get optimal grid layout based on media types in collection
export const getOptimalGridLayout = (media) => {
  // This is a placeholder. In a real scenario, you might analyze the media
  // aspect ratios to create a more dynamic and visually appealing layout.
  // For example, you could implement a masonry or mosaic layout algorithm here.
  
  // Default grid layout
  return {
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    aspectRatio: '16/9',
    spacing: 'md',
    layout: 'default'
  };
};

// Get accessible ARIA labels for media items
export const getARIALabels = (item) => {
  const type = item.mediaType || 'media';
  const title = item.title || 'Untitled';
  
  return {
    label: `${title} - ${type}`,
    description: item.description || `A media element of type ${type} showing ${title}.`
  };
}; 