import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = 'public';
const STANDARD_SOURCE = path.join(PUBLIC_DIR, 'icon-source.svg');
const MASKABLE_SOURCE = path.join(PUBLIC_DIR, 'maskable-icon-source.svg');

const icons = [
  { name: 'favicon-16x16.png', size: 16, source: STANDARD_SOURCE },
  { name: 'favicon-32x32.png', size: 32, source: STANDARD_SOURCE },
  { name: 'apple-touch-icon.png', size: 180, source: STANDARD_SOURCE },
  { name: 'android-chrome-192x192.png', size: 192, source: STANDARD_SOURCE },
  { name: 'android-chrome-512x512.png', size: 512, source: STANDARD_SOURCE },
  { name: 'maskable-icon-512x512.png', size: 512, source: MASKABLE_SOURCE },
];

async function generateIcons() {
  console.log('🚀 Starting PWA icon generation...');

  for (const icon of icons) {
    const outputPath = path.join(PUBLIC_DIR, icon.name);
    try {
      await sharp(icon.source)
        .resize(icon.size, icon.size)
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Error generating ${icon.name}:`, error.message);
    }
  }

  console.log('✨ All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
