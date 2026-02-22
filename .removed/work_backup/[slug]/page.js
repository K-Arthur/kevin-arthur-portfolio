import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { isMetadataStale, getFreshProjectData } from '@/lib/serverUtils';
import { PROJECT_CONFIG } from '@/lib/projectConfig';
import ProjectClient from './ProjectClient';

export async function generateStaticParams() {
  return Object.keys(PROJECT_CONFIG).map((slug) => ({
    slug,
  }));
}

async function getProjectData(slug) {
  try {
    // Check if we should fetch fresh data
    const isStale = await isMetadataStale(30); // Check if older than 30 minutes

    if (isStale) {
      console.log('Fetching fresh data from Cloudinary for:', slug);

      // Get project config
      const config = PROJECT_CONFIG[slug];
      if (!config) {
        return null;
      }

      // Try to get fresh data
      const freshData = await getFreshProjectData(slug, config);
      if (freshData) {
        // Manually create groupedMedia and map properties
        if (freshData && freshData.media) {
          freshData.groupedMedia = {
            'All Media': freshData.media.map(item => ({
              ...item,
              type: item.format === 'mp4' ? 'video' : item.mediaType,
              src: item.url,
              mediaType: item.format === 'mp4' ? 'video' : item.mediaType
            }))
          };
        }
        return freshData;
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
      return null;
    }

    // Find the project in pre-computed metadata
    const project = metadata[slug];

    if (!project) {
      console.error('Project not found in metadata:', slug);
      return null;
    }

    // Ensure groupedMedia exists on cached data too if missing (though it should be there if cached correctly, 
    // but the client logic added it manually, so we do it here too just in case)
    if (project && project.media && !project.groupedMedia) {
      project.groupedMedia = {
        'All Media': project.media.map(item => ({
          ...item,
          type: item.format === 'mp4' ? 'video' : item.mediaType,
          src: item.url,
          mediaType: item.format === 'mp4' ? 'video' : item.mediaType
        }))
      };
    }

    console.log('Serving cached project data for:', slug);
    return project;

  } catch (error) {
    console.error('Error serving project:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const project = await getProjectData(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} - Kevin Arthur`,
    description: project.description || `View details for ${project.title}`,
    openGraph: {
      title: `${project.title} - Kevin Arthur`,
      description: project.description || `View details for ${project.title}`,
      images: project.heroAsset ? [project.heroAsset.url] : [],
    },
    alternates: {
      canonical: `https://kevinarthur.design/work/${slug}`
    }
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = params;
  const project = await getProjectData(slug);

  if (!project) {
    notFound();
  }

  return <ProjectClient initialProject={project} slug={slug} />;
}
