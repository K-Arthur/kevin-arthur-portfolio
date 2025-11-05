import path from 'path';

// Centralized project configuration for My UI Engineering Portfolio
// Focused on high-value product case studies that demonstrate UI Engineering expertise

export const PROJECT_CONFIG = {
  // Featured Case Studies - Focused on UI Engineering Impact
  'moremi-ai-collaborate': {
    folder: 'Moremi AI Collaborate',
    title: 'Moremi AI - Collaborative AI Platform',
    category: 'Case-Studies',
    type: 'web-app',
    preferredThumbnail: 'main-interface.png',
    description: 'Led end-to-end design and frontend development of an AI collaboration platform',
    tags: ['React', 'Next.js', 'TypeScript', 'Figma', 'AI/ML', 'SaaS']
  },
  'minohealth-radiology': {
    folder: 'MinoHealth Radiology Platform',
    title: 'MinoHealth - Radiology AI Platform',
    category: 'Case-Studies',
    type: 'web-app',
    preferredThumbnail: 'dashboard.png',
    description: 'Designed and implemented the UI for an AI-powered radiology platform',
    tags: ['React', 'TypeScript', 'Figma', 'Healthcare', 'AI/ML', 'Dashboard']
  },
  'snackbox-404': {
    folder: 'Snackbox',
    title: 'SnackBox 404 - Interactive Experience',
    category: 'Case-Studies',
    type: 'web-app',
    preferredThumbnail: '404-page.png',
    description: 'Designed and developed an engaging 404 page with 3D interactions',
    tags: ['React', 'Three.js', 'Framer Motion', 'Figma', '3D Design']
  },

  // Graphic Design & Branding Projects
  'freelance-collection': {
    folder: 'Freelance',
    title: 'Freelance Collection',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'portfolio-cover.png',
    description: 'Collection of freelance branding and design projects',
    tags: ['Branding', 'Logo Design', 'Identity', 'Freelance']
  },
  'stridd-brand': {
    folder: 'Stridd',
    title: 'Stridd',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'brand-identity.png',
    description: 'Complete brand identity for Stridd platform',
    tags: ['Branding', 'Identity', 'Logo', 'Platform']
  },
  'muna-kalati': {
    folder: 'Muna Kalati',
    title: 'Muna Kalati',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'brand-showcase.png',
    description: 'Cultural brand identity and visual system',
    tags: ['Branding', 'Cultural', 'Identity', 'Visual System']
  },
  'minohealth-ai-labs': {
    folder: 'minoHealth AI Labs',
    title: 'minoHealth AI Labs',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'ai-labs-brand.png',
    description: 'AI healthcare company branding and identity',
    tags: ['Branding', 'AI', 'Healthcare', 'Technology']
  },
  'meraki-brand': {
    folder: 'Meraki',
    title: 'Meraki',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'meraki-identity.png',
    description: 'Creative agency brand identity and collateral',
    tags: ['Branding', 'Agency', 'Creative', 'Identity']
  },
  'art-on-piece': {
    folder: 'Art on Piece',
    title: 'Art on Piece',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'art-brand.png',
    description: 'Art gallery and exhibition branding',
    tags: ['Branding', 'Art', 'Gallery', 'Exhibition']
  },
  'casting-africa': {
    folder: 'Casting Africa',
    title: 'Casting Africa',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'casting-brand.png',
    description: 'Entertainment casting platform branding',
    tags: ['Branding', 'Entertainment', 'Casting', 'Platform']
  },
  'crimson-hive': {
    folder: 'Crimson Hive',
    title: 'Crimson Hive',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'crimson-identity.png',
    description: 'Tech startup brand identity and guidelines',
    tags: ['Branding', 'Startup', 'Technology', 'Identity']
  },
  'this-and-that': {
    folder: 'This and That',
    title: 'This and That',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'brand-system.png',
    description: 'Lifestyle brand identity and packaging',
    tags: ['Branding', 'Lifestyle', 'Packaging', 'Identity']
  },
  'slc-brand': {
    folder: 'SLC',
    title: 'SLC',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'slc-brand.png',
    description: 'Corporate brand identity and guidelines',
    tags: ['Branding', 'Corporate', 'Identity', 'Guidelines']
  },
  'siscode': {
    folder: 'Siscode',
    title: 'Siscode',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'siscode-brand.png',
    description: 'Software company brand identity',
    tags: ['Branding', 'Software', 'Technology', 'Identity']
  },
  'sealed-brand': {
    folder: 'Sealed',
    title: 'Sealed',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'sealed-identity.png',
    description: 'Security platform brand identity',
    tags: ['Branding', 'Security', 'Platform', 'Identity']
  },
  'jakide': {
    folder: 'Jakide',
    title: 'Jakide',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'jakide-brand.png',
    description: 'Fashion brand identity and visual system',
    tags: ['Branding', 'Fashion', 'Identity', 'Visual System']
  },
  'from-the-hills': {
    folder: 'From The Hills',
    title: 'From The Hills',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'hills-brand.png',
    description: 'Organic food brand identity and packaging',
    tags: ['Branding', 'Organic', 'Food', 'Packaging']
  },
  'christian-elongue': {
    folder: 'Christian Elongue Consulting',
    title: 'Christian Elongue Consulting',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'consulting-brand.png',
    description: 'Professional consulting brand identity',
    tags: ['Branding', 'Consulting', 'Professional', 'Identity']
  },
  'charles-tech': {
    folder: 'Charles Technologies',
    title: 'Charles Technologies',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'charles-brand.png',
    description: 'Technology company brand identity',
    tags: ['Branding', 'Technology', 'Corporate', 'Identity']
  },
  'captain-awesome': {
    folder: 'Captain Awesome',
    title: 'Captain Awesome',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'captain-brand.png',
    description: 'Entertainment brand identity and character design',
    tags: ['Branding', 'Entertainment', 'Character', 'Identity']
  },
  'agromyx': {
    folder: 'Agromyx',
    title: 'Agromyx',
    category: 'Graphic-Design-Branding',
    type: 'brand-identity',
    preferredThumbnail: 'agromyx-brand.png',
    description: 'Branding for an agricultural technology company.',
    tags: ['Branding', 'Agrotech', 'Identity']
  },

  // Video & Motion Graphics Projects
  'casting-africa-video': {
    folder: 'Casting Africa',
    title: 'Casting Africa - Motion Graphics',
    category: 'Video-Motion-Graphics',
    type: 'video',
    description: 'Promotional motion graphics for the Casting Africa platform.',
    tags: ['Video', 'Motion Graphics', 'Promo', 'Animation']
  },
  'stridd-video': {
    folder: 'Stridd',
    title: 'Stridd - Brand Video',
    category: 'Video-Motion-Graphics',
    type: 'video',
    description: 'Brand video for the Stridd platform.',
    tags: ['Video', 'Brand Film', 'Animation']
  },
  'mike-plein-video': {
    folder: 'Mike Plein',
    title: 'Mike Plein Showreel',
    category: 'Video-Motion-Graphics',
    type: 'video',
    description: 'A showreel for video editor Mike Plein.',
    tags: ['Video', 'Showreel', 'Video Editing']
  },
  'moremi-ai-video': {
    folder: 'Moremi AI',
    title: 'Moremi AI - Product Demo',
    category: 'Video-Motion-Graphics',
    type: 'video',
    description: 'Product demonstration video for the Moremi AI application.',
    tags: ['Video', 'Product Demo', 'AI', 'Animation']
  },
  'crimson-hive-video': {
    folder: 'Crimson Hive',
    title: 'Crimson Hive - Explainer Video',
    category: 'Video-Motion-Graphics',
    type: 'video',
    description: 'Explainer video for the Crimson Hive tech startup.',
    tags: ['Video', 'Explainer', 'Animation', 'Startup']
  },
};

// Helper function to get project config by slug
export const getProjectConfig = (slug) => {
  return PROJECT_CONFIG[slug] || null;
};

// Helper function to get all projects by category
export const getProjectsByCategory = (category) => {
  return Object.entries(PROJECT_CONFIG)
    .filter(([_, config]) => config.category === category)
    .map(([slug, config]) => ({ slug, ...config }));
};

// Helper function to generate slug from folder name (fallback)
export const generateSlug = (folderName) => {
  return folderName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Helper function to find best thumbnail
export const findBestThumbnail = (files, preferredThumbnail = null) => {
  const imageFiles = files.filter(file => 
    ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(
      file.ext?.toLowerCase() || path.extname(file).toLowerCase()
    )
  );

  if (imageFiles.length === 0) return null;

  // If preferred thumbnail is specified, look for it
  if (preferredThumbnail) {
    const preferred = imageFiles.find(file => 
      (file.name || path.basename(file, path.extname(file))) === path.basename(preferredThumbnail, path.extname(preferredThumbnail))
    );
    if (preferred) return preferred;
  }

  // Fallback priority order
  const priorities = [
    /^(hero|main|cover|thumbnail|preview)/i,
    /^(home|landing|dashboard|interface)/i,
    /^(app|screen|mockup)/i,
    /^(brand|logo|identity)/i,
    /\.(jpg|jpeg)$/i, // Prefer JPEG over PNG for thumbnails
    /\.(png)$/i
  ];

  for (const priority of priorities) {
    const match = imageFiles.find(file => {
      const fileName = file.name || path.basename(file, path.extname(file));
      const fullName = file.relativePath || file;
      return priority.test(fileName) || priority.test(fullName);
    });
    if (match) return match;
  }

  // Return first image as final fallback
  return imageFiles[0];
}; 