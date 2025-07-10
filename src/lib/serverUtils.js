// Server-side media utilities (Node.js only)
import fs, { promises as fsPromises } from 'fs';
import path from 'path';
import { getPlaiceholder } from 'plaiceholder';

// Helper function to get image dimensions
export async function getImageDimensions(imagePath) {
  try {
    const sharp = require('sharp');
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    };
  } catch (error) {
    console.warn('Could not get image dimensions:', error);
    return { width: 0, height: 0, format: 'unknown' };
  }
}

// Helper function to get video metadata
export async function getVideoMetadata(videoPath) {
  // For now, return basic metadata
  // In production, you might want to use ffprobe or similar
  const stats = await fsPromises.stat(videoPath);
  return {
    size: stats.size,
    format: path.extname(videoPath).substring(1).toLowerCase()
  };
}

// Generate blur placeholder for images
export async function generateBlurPlaceholder(imagePath) {
  try {
    const buffer = await fsPromises.readFile(imagePath);
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (error) {
    console.warn('Could not generate blur placeholder:', error);
    return null;
  }
}

// Helper function to recursively get all files (synchronous)
export function getAllFiles(dirPath, arrayOfFiles = []) {
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
} 