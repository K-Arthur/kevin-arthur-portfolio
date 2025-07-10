import fs from 'fs';
import path from 'path';
import WorkClientPage from '@/components/WorkClientPage';

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

const getProjects = () => {
  try {
    // Read pre-computed metadata
    const metadataPath = path.join(process.cwd(), 'src', 'data', 'media-metadata.json');
    
    if (!fs.existsSync(metadataPath)) {
      console.error('Metadata file not found. Please run: npm run generate-metadata');
      return [];
    }
    
    const metadataFile = fs.readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(metadataFile);
    
    // Transform categories data for the UI
    const categorizedProjects = Object.entries(categoryDisplayNames).map(([categoryKey, displayName]) => {
      const projects = (metadata.categories[categoryKey] || []).map(project => ({
        ...project,
        category: displayName,
      }));
      
      // Sort projects by title
      const sortedProjects = projects.sort((a, b) => a.title.localeCompare(b.title));
      
      return {
        name: displayName,
        projects: sortedProjects
      };
    });
    
    // Filter out empty categories
    return categorizedProjects.filter(category => category.projects.length > 0);
    
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

export default async function WorkPage() {
  const projects = getProjects();
  return <WorkClientPage projects={projects} />;
}
