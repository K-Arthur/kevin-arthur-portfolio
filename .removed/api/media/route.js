export async function generateStaticParams() { return []; }
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaPath = searchParams.get('path');
    
    if (!mediaPath) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }

    // Security check - ensure the path is within the public directory
    const publicDir = path.join(process.cwd(), 'public');
    const fullPath = path.join(publicDir, mediaPath);
    
    // Resolve the path and check if it's within public directory
    const resolvedPath = path.resolve(fullPath);
    const resolvedPublicDir = path.resolve(publicDir);
    
    if (!resolvedPath.startsWith(resolvedPublicDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    // Check if file exists
    try {
      await fs.access(resolvedPath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get file stats
    const stats = await fs.stat(resolvedPath);
    const fileSize = stats.size;
    
    // Determine content type
    const ext = path.extname(resolvedPath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.mp4':
        contentType = 'video/mp4';
        break;
      case '.mov':
        contentType = 'video/quicktime';
        break;
      case '.avi':
        contentType = 'video/x-msvideo';
        break;
      case '.webm':
        contentType = 'video/webm';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    // Check for range requests (for video streaming)
    const range = request.headers.get('range');
    
    if (range && contentType.startsWith('video/')) {
      // Parse range header
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      // Read the chunk
      const buffer = Buffer.alloc(chunksize);
      const fileHandle = await fs.open(resolvedPath, 'r');
      await fileHandle.read(buffer, 0, chunksize, start);
      await fileHandle.close();
      
      // Return partial content
      return new NextResponse(buffer, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000', // 1 year
        },
      });
    }

    // For non-range requests or non-video files, serve the entire file
    const fileBuffer = await fs.readFile(resolvedPath);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000', // 1 year
        'Content-Disposition': contentType.startsWith('video/') ? 'inline' : 'attachment',
      },
    });
    
  } catch (error) {
    console.error('Media serving error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


