// This file will be the new source of truth for all media assets.
// Replace the placeholder URLs with the actual URLs from your Cloudinary account.

export const MEDIA_MANIFEST = {
  'UI-UX-Design': [
    {
      name: 'Moremi AI V1 (minoChat)',
      slug: 'moremi-ai-v1',
      media: [
        { type: 'image', url: 'YOUR_CLOUDINARY_URL_HERE' },
        { type: 'image', url: 'YOUR_CLOUDINARY_URL_HERE' },
        { type: 'image', url: 'YOUR_CLOUDINARY_URL_HERE' },
        { type: 'image', url: 'YOUR_CLOUDINARY_URL_HERE' },
        { type: 'image', url: 'YOUR_CLOUDINARY_URL_HERE' },
        { type: 'image', url: 'YOUR_CLOUDINARY_URL_HERE' },
      ],
    },
    // ... Add all other UI/UX projects here following the same structure
  ],
  'Graphic-Design-Branding': [
    {
      name: 'Freelance Collection',
      slug: 'freelance-collection',
      media: [
         // Add all 30 freelance images here
        { type: 'image', url: 'YOUR_CLOUDINARY_URL_HERE' },
      ],
    },
    // ... Add all other Graphic Design projects here
  ],
  'Video-Motion-Graphics': [
    {
      name: 'Casting Africa',
      slug: 'casting-africa',
      media: [
        { type: 'video', url: 'YOUR_CLOUDINARY_VIDEO_URL_HERE', thumbnail: 'YOUR_CLOUDINARY_THUMBNAIL_URL_HERE' },
        // ... other videos
      ],
    },
     // ... Add all other Video projects here
  ],
}; 