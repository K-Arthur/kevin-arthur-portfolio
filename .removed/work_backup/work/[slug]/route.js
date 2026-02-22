import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isMetadataStale, getFreshProjectData } from '@/lib/serverUtils';
import { PROJECT_CONFIG } from '@/lib/projectConfig';

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    // Check if we should fetch fresh data
    const forceRefresh = new URL(request.url).searchParams.get('refresh') === 'true';
    const isStale = await isMetadataStale(30); // Check if older than 30 minutes

    if (forceRefresh || isStale) {
      console.log('Fetching fresh data from Cloudinary for:', slug);

      // Get project config
      const config = PROJECT_CONFIG[slug];
      if (!config) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      // Try to get fresh data
      const freshData = await getFreshProjectData(slug, config);
      if (freshData) {
        return NextResponse.json(freshData);
      }

      console.log('Failed to fetch fresh data, falling back to cached data');
    }

    // Read pre-computed metadata as fallback
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
    const project = metadata[slug];

    if (!project) {
      console.error('Project not found in metadata:', slug);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    console.log('Serving cached project data for:', slug);

    return NextResponse.json(project);

  } catch (error) {
    console.error('Error serving project:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
export async function generateStaticParams() {
  return Object.keys(PROJECT_CONFIG).map((slug) => ({
    slug,
  }));
}
