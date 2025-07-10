import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    // Read pre-computed metadata
    const metadataPath = path.join(process.cwd(), 'src', 'data', 'media-metadata.json');
    
    let metadata;
    try {
      const metadataFile = await fs.readFile(metadataPath, 'utf8');
      metadata = JSON.parse(metadataFile);
    } catch (error) {
      console.error('Failed to read metadata file:', error);
      return NextResponse.json({ 
        error: 'Metadata not found. Please run: npm run generate-metadata' 
      }, { status: 500 });
    }
    
    // Find the project in pre-computed metadata
    const project = metadata.projects[slug];
    
    if (!project) {
      console.error('Project not found in metadata:', slug);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    console.log('Serving pre-computed project data for:', slug);
    
    return NextResponse.json(project);
    
  } catch (error) {
    console.error('Error serving project:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
