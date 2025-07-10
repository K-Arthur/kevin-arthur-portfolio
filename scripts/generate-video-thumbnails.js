const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Helper function to recursively get all files in a directory
const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file.name), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file.name));
    }
  });

  return arrayOfFiles;
};

// Function to check if ffmpeg is available
const checkFFmpeg = () => {
  return new Promise((resolve) => {
    exec('ffmpeg -version', (error) => {
      resolve(!error);
    });
  });
};

// Function to generate thumbnail using ffmpeg
const generateThumbnail = (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${outputPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(outputPath);
      }
    });
  });
};

// Main function
const generateVideoThumbnails = async () => {
  console.log('🎬 Video Thumbnail Generator');
  console.log('============================\n');

  const videoDir = path.join(process.cwd(), 'public', 'images', 'work', 'Video-Motion-Graphics');
  
  if (!fs.existsSync(videoDir)) {
    console.error('❌ Video directory not found:', videoDir);
    return;
  }

  const allFiles = getAllFiles(videoDir);
  const videoFiles = allFiles.filter(filePath => 
    videoExtensions.includes(path.extname(filePath).toLowerCase())
  );

  if (videoFiles.length === 0) {
    console.log('ℹ️  No video files found in the directory.');
    return;
  }

  console.log(`📹 Found ${videoFiles.length} video files`);
  
  // Check if ffmpeg is available
  const hasFFmpeg = await checkFFmpeg();
  
  if (!hasFFmpeg) {
    console.log('\n⚠️  FFmpeg not found. Please install FFmpeg to auto-generate thumbnails.');
    console.log('   Download from: https://ffmpeg.org/download.html\n');
    console.log('📋 Manual thumbnail creation guide:');
    console.log('   1. Open each video file in a video player');
    console.log('   2. Seek to a good frame (around 1-2 seconds)');
    console.log('   3. Take a screenshot and save as JPG/PNG');
    console.log('   4. Name the thumbnail the same as the video file (but with image extension)');
    console.log('   5. Place it in the same directory as the video\n');
    
    console.log('📁 Video files that need thumbnails:');
    videoFiles.forEach(videoFile => {
      const baseName = path.basename(videoFile, path.extname(videoFile));
      const dir = path.dirname(videoFile);
      const existingThumbnail = allFiles.find(f => {
        const fExt = path.extname(f).toLowerCase();
        const fBase = path.basename(f, fExt);
        return fBase === baseName && imageExtensions.includes(fExt);
      });
      
      if (!existingThumbnail) {
        const relativePath = path.relative(videoDir, videoFile);
        console.log(`   📹 ${relativePath}`);
        console.log(`      → Create: ${baseName}.jpg (or .png)`);
      }
    });
    return;
  }

  console.log('✅ FFmpeg found! Generating thumbnails...\n');

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const videoFile of videoFiles) {
    const baseName = path.basename(videoFile, path.extname(videoFile));
    const dir = path.dirname(videoFile);
    
    // Check if thumbnail already exists
    const existingThumbnail = allFiles.find(f => {
      const fExt = path.extname(f).toLowerCase();
      const fBase = path.basename(f, fExt);
      return fBase === baseName && imageExtensions.includes(fExt);
    });
    
    if (existingThumbnail) {
      console.log(`⏭️  Skipping ${baseName} (thumbnail exists)`);
      skipped++;
      continue;
    }

    const thumbnailPath = path.join(dir, `${baseName}.jpg`);
    const relativePath = path.relative(videoDir, videoFile);
    
    try {
      console.log(`🎬 Generating thumbnail for ${relativePath}...`);
      await generateThumbnail(videoFile, thumbnailPath);
      console.log(`✅ Created: ${path.basename(thumbnailPath)}`);
      generated++;
    } catch (error) {
      console.error(`❌ Error generating thumbnail for ${relativePath}:`, error.message);
      errors++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Generated: ${generated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  
  if (generated > 0) {
    console.log('\n🎉 Thumbnails generated successfully!');
    console.log('   Restart your development server to see the changes.');
  }
};

// Run the script
generateVideoThumbnails().catch(console.error); 