const fs = require('fs');
const path = require('path');

// SVG template for the favicon
const createFaviconSVG = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.1875)}" fill="url(#gradient)"/>
  <text x="${size/2}" y="${size * 0.72}" font-family="system-ui, -apple-system, sans-serif" font-size="${size * 0.5}" font-weight="bold" text-anchor="middle" fill="white">KA</text>
</svg>`;

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate different sizes
const sizes = [16, 32, 48, 180, 192, 512];

sizes.forEach(size => {
  const svg = createFaviconSVG(size);
  const filename = size === 180 ? 'apple-touch-icon.svg' : 
                   size === 192 ? 'android-chrome-192x192.svg' :
                   size === 512 ? 'android-chrome-512x512.svg' :
                   `favicon-${size}x${size}.svg`;
  
  fs.writeFileSync(path.join(publicDir, filename), svg);
  console.log(`Generated ${filename}`);
});

// Create main favicon.ico reference (browsers will use SVG)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), '');
console.log('Created favicon.ico placeholder');

// Create site.webmanifest
const manifest = {
  "name": "Kevin Arthur",
  "short_name": "Kevin Arthur",
  "icons": [
    {
      "src": "/android-chrome-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    },
    {
      "src": "/android-chrome-512x512.svg", 
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ],
  "theme_color": "#3B82F6",
  "background_color": "#ffffff",
  "display": "standalone"
};

fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
console.log('Generated site.webmanifest');

console.log('✅ All favicon files generated successfully!');