import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isMetadataStale, getFreshProjectData } from '@/lib/serverUtils';
import { PROJECT_CONFIG } from '@/lib/projectConfig';

// Helper to get all projects, either from cache or fresh from Cloudinary
async function getAllProjects() {
    const allProjects = {};
    for (const [slug, config] of Object.entries(PROJECT_CONFIG)) {
        const projectData = await getFreshProjectData(slug, config);
        if (projectData) {
            allProjects[slug] = projectData;
        }
    }
    
    // Asynchronously write the fresh data back to the cache file
    const outputPath = path.join(process.cwd(), 'src', 'data', 'media-metadata.json');
    fs.writeFile(outputPath, JSON.stringify(allProjects, null, 2)).catch(err => {
        console.error('Failed to write updated metadata file:', err);
    });

    return allProjects;
}


export async function GET(request) {
  try {
    const forceRefresh = new URL(request.url).searchParams.get('refresh') === 'true';
    const stale = await isMetadataStale(60); // Check if older than 60 minutes

    let projects;

    if (forceRefresh || stale) {
        console.log('Metadata is stale or refresh is forced. Fetching all projects from Cloudinary.');
        projects = await getAllProjects();
    } else {
        console.log('Serving all projects from cached media-metadata.json');
        const metadataPath = path.join(process.cwd(), 'src', 'data', 'media-metadata.json');
        try {
            const metadataFile = await fs.readFile(metadataPath, 'utf8');
            projects = JSON.parse(metadataFile);
        } catch (error) {
            console.warn('Cached metadata not found or readable, fetching fresh data.');
            projects = await getAllProjects();
        }
    }

    const projectsByCategory = {};
    const categoryDisplayNames = {
      'Graphic-Design-Branding': 'Graphic Design & Branding',
      'UI-UX-Design': 'UI/UX Design',
      'Video-Motion-Graphics': 'Video & Motion Graphics'
    };

    Object.values(projects).forEach(project => {
      if (project.category) {
        if (!projectsByCategory[project.category]) {
          projectsByCategory[project.category] = [];
        }
        projectsByCategory[project.category].push(project);
      }
    });

    const categorizedProjects = Object.entries(categoryDisplayNames).map(([categoryKey, displayName]) => {
      const projs = (projectsByCategory[categoryKey] || []).map(p => ({
        ...p,
        category: displayName,
      })).sort((a, b) => a.title.localeCompare(b.title));
      
      return {
        name: displayName,
        projects: projs
      };
    });

    return NextResponse.json(categorizedProjects.filter(c => c.projects.length > 0));

  } catch (error) {
    console.error('Error in /api/work route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 