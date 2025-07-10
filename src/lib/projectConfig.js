import path from 'path';

// Centralized project configuration
// This eliminates the need to manually update API routes when adding new projects

export const PROJECT_CONFIG = {
  // UI/UX Design Projects
  'moremi-ai-v1': {
    folder: 'Moremi AI V1 (minoChat)',
    title: 'Moremi AI V1 (minoChat)',
    category: 'UI-UX-Design',
    type: 'mobile-app',
    preferredThumbnail: 'hero.png', // Preferred thumbnail filename
    description: 'AI-powered chat application with modern mobile interface',
    tags: ['Mobile App', 'AI', 'Chat Interface', 'iOS', 'Android']
  },
  'minohealth-radiology': {
    folder: 'MinoHealth Radiology Platform',
    title: 'MinoHealth Radiology Platform',
    category: 'UI-UX-Design',
    type: 'web-app',
    preferredThumbnail: 'dashboard.png',
    description: 'Medical radiology platform with comprehensive dashboard',
    tags: ['Web App', 'Healthcare', 'Dashboard', 'Medical']
  },
  'moremi-ai-collaborate': {
    folder: 'Moremi AI Collaborate',
    title: 'Moremi AI Collaborate',
    category: 'UI-UX-Design',
    type: 'web-app',
    preferredThumbnail: 'main-interface.png',
    description: 'Collaborative AI platform for team productivity',
    tags: ['Web App', 'AI', 'Collaboration', 'SaaS']
  },
  'true-sms': {
    folder: 'True SMS',
    title: 'True SMS',
    category: 'UI-UX-Design',
    type: 'web-app',
    preferredThumbnail: 'landing.png',
    description: 'SMS marketing platform with analytics dashboard',
    tags: ['Web App', 'Marketing', 'SMS', 'Analytics']
  },
  'recipemania': {
    folder: 'Recipemania',
    title: 'Recipemania',
    category: 'UI-UX-Design',
    type: 'mobile-app',
    preferredThumbnail: 'app-screens.png',
    description: 'Recipe sharing and cooking mobile application',
    tags: ['Mobile App', 'Food', 'Social', 'Recipe']
  },
  'furniture-app': {
    folder: 'Furniture App',
    title: 'Furniture App',
    category: 'UI-UX-Design',
    type: 'mobile-app',
    preferredThumbnail: 'home-screen.png',
    description: 'E-commerce furniture shopping mobile app',
    tags: ['Mobile App', 'E-commerce', 'Furniture', 'Shopping']
  },
  'vieu': {
    folder: 'Vieu',
    title: 'Vieu',
    category: 'UI-UX-Design',
    type: 'web-app',
    preferredThumbnail: 'dashboard.png',
    description: 'Video analytics and management platform',
    tags: ['Web App', 'Video', 'Analytics', 'SaaS']
  },
  'agent-direct': {
    folder: 'Agent Direct',
    title: 'Agent Direct',
    category: 'UI-UX-Design',
    type: 'web-app',
    preferredThumbnail: 'interface.png',
    description: 'Real estate agent management platform',
    tags: ['Web App', 'Real Estate', 'CRM', 'Management']
  },
  'rise-app-redesign': {
    folder: 'Rise App Redesign',
    title: 'Rise App Redesign',
    category: 'UI-UX-Design',
    type: 'mobile-app',
    preferredThumbnail: 'redesign-showcase.png',
    description: 'Complete redesign of Rise investment app',
    tags: ['Mobile App', 'Fintech', 'Investment', 'Redesign']
  },
  'minohealth-blog': {
    folder: 'MinoHealth Blog',
    title: 'MinoHealth Blog',
    category: 'UI-UX-Design',
    type: 'website',
    preferredThumbnail: 'blog-home.png',
    description: 'Healthcare blog platform with modern design',
    tags: ['Website', 'Blog', 'Healthcare', 'Content']
  },
  'snackbox': {
    folder: 'Snackbox',
    title: 'Snackbox',
    category: 'UI-UX-Design',
    type: 'web-app',
    preferredThumbnail: 'main-app.png',
    description: 'Snack subscription and delivery platform',
    tags: ['Web App', 'E-commerce', 'Subscription', 'Food']
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
    description: 'Agricultural technology brand identity',
    tags: ['Branding', 'Agriculture', 'Technology', 'Identity']
  },

  // Video & Motion Graphics (Category-level entry)
  'video-motion-graphics': {
    folder: null, // Special case for category
    title: 'Video & Motion Graphics',
    category: 'Video-Motion-Graphics',
    type: 'video-category',
    preferredThumbnail: null,
    description: 'Collection of video and motion graphics projects',
    tags: ['Video', 'Motion Graphics', 'Animation', 'Visual Effects']
  }
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