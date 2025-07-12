import fs from 'fs';
import path from 'path';
import WorkClientPage from '@/components/WorkClientPage';
import { isMetadataStale, getFreshProjectData } from '@/lib/serverUtils';
import { PROJECT_CONFIG } from '@/lib/projectConfig';

export const metadata = {
  title: 'Work - Kevin Arthur',
  description: 'A showcase of UI/UX, graphic design, and branding projects by Kevin Arthur.',
};

// Map folder names to display names
const categoryDisplayNames = {
  'Graphic-Design-Branding': 'Graphic Design & Branding',
  'UI-UX-Design': 'UI/UX Design',
  'Video-Motion-Graphics': 'Video & Motion Graphics'
};

const getFreshProjects = async () => {
  console.log('Fetching fresh project data from Cloudinary...');
  const freshProjects = {};
  
  for (const [slug, config] of Object.entries(PROJECT_CONFIG)) {
    try {
      const projectData = await getFreshProjectData(slug, config);
      if (projectData) {
        freshProjects[slug] = projectData;
      }
    } catch (error) {
      console.error(`Error fetching fresh data for ${slug}:`, error);
    }
  }
  
  return freshProjects;
};

const getProjects = async () => {
  try {
    // Check if we should fetch fresh data
    const isStale = await isMetadataStale(30); // Check if older than 30 minutes
    
    let allProjects = {};
    
    if (isStale) {
      console.log('Metadata is stale, fetching fresh data...');
      allProjects = await getFreshProjects();
      
      // If we got fresh data, use it; otherwise fall back to cached data
      if (Object.keys(allProjects).length === 0) {
        console.log('Failed to fetch fresh data, falling back to cached data');
        // Fall through to cached data loading
      }
    }
    
    // Load cached data if we don't have fresh data
    if (Object.keys(allProjects).length === 0) {
      const metadataPath = path.join(process.cwd(), 'src', 'data', 'media-metadata.json');
      
      if (!fs.existsSync(metadataPath)) {
        console.error('Metadata file not found. Please run: npm run generate-metadata');
        return [];
      }
      
      const metadataFile = await fs.promises.readFile(metadataPath, 'utf8');
      allProjects = JSON.parse(metadataFile);
    }
    
    const projectsByCategory = {};
    Object.values(allProjects).forEach(project => {
      if (project.category) {
        if (!projectsByCategory[project.category]) {
          projectsByCategory[project.category] = [];
        }
        projectsByCategory[project.category].push(project);
      }
    });

    const categorizedProjects = Object.entries(categoryDisplayNames).map(([categoryKey, displayName]) => {
      const projects = (projectsByCategory[categoryKey] || []).map(project => ({
        ...project,
        category: displayName,
      }));
      
      const sortedProjects = projects.sort((a, b) => a.title.localeCompare(b.title));
      
      return {
        name: displayName,
        projects: sortedProjects
      };
    });
    
    return categorizedProjects.filter(category => category.projects.length > 0);
    
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

export default async function WorkPage() {
  const projects = await getProjects();
  return <WorkClientPage projects={projects} />;
}
