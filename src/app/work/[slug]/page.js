'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Play, Clock, HardDrive, Tag, Folder, Grid, List } from 'lucide-react';
import MediaGrid from '@/components/MediaGrid';
import { MEDIA_TYPES, getOptimalGridLayout } from '@/lib/mediaUtils';
import VideoDetails from './VideoDetails';

// Modular components for better organization
const ProjectHeader = ({ project, isVideoProject }) => (
  <div className="mb-8 md:mb-12">
    <div className="flex items-start gap-4 mb-4">
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
          {project.title}
        </h1>
        <p className="text-md sm:text-lg text-muted-foreground mt-2">
          {project.category}
        </p>
      </div>
    </div>
  </div>
);

const ProjectStats = ({ project, isVideoProject, activeGroupMedia, getMediaTypeStats, getMediaTypeLabel }) => (
  <div className="flex flex-wrap gap-x-6 gap-y-4 mt-6">
    {isVideoProject && (
      <>
        <div className="flex items-center gap-2 px-3 py-2 bg-card/60 rounded-lg border border-border/30 text-sm">
          <Play className="w-4 h-4 text-primary" />
          <span className="font-medium">{project.totalVideos} Videos</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-card/60 rounded-lg border border-border/30 text-sm">
          <Folder className="w-4 h-4 text-primary" />
          <span className="font-medium">{project.projects} Projects</span>
        </div>
      </>
    )}
    
    {/* Media Type Stats for Active Group */}
    {activeGroupMedia.length > 0 && (
      Object.entries(getMediaTypeStats(activeGroupMedia)).map(([type, count]) => (
        <div key={type} className="flex items-center gap-2 px-3 py-2 bg-card/60 rounded-lg border border-border/30 text-sm">
          <Tag className="w-4 h-4 text-primary" />
          <span className="font-medium">{count} {getMediaTypeLabel(type)}{count > 1 ? 's' : ''}</span>
        </div>
      ))
    )}
  </div>
);

const GroupNavigation = ({ groupNames, activeGroup, setActiveGroup, project }) => {
  if (groupNames.length <= 1) return null;
  
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex flex-wrap gap-3">
        {groupNames.map((groupName) => (
          <button
            key={groupName}
            onClick={() => setActiveGroup(groupName)}
            className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg font-medium transition-all duration-200 ${
              activeGroup === groupName
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card/60 text-foreground hover:bg-card/80 border border-border/30'
            }`}
            aria-pressed={activeGroup === groupName}
          >
            {groupName}
            <span className="ml-2 text-xs opacity-75">
              ({project.groupedMedia[groupName].length})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const VideoProjectSection = ({ activeGroup, activeGroupMedia, formattedActiveMedia }) => (
  <section className="space-y-8">
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
        {activeGroup}
      </h2>
      <p className="text-muted-foreground text-sm sm:text-base mb-4">
        {activeGroupMedia.length} video{activeGroupMedia.length !== 1 ? 's' : ''}
      </p>
      <div className="w-24 h-1 bg-gradient-to-r from-primary/50 to-primary mx-auto rounded-full"></div>
    </div>
    
    <MediaGrid
      media={formattedActiveMedia}
      enableLazyLoading={true}
      showMetadata={true}
      adaptiveLayout={true}
      className="w-full"
    />
  </section>
);

const RegularProjectSection = ({ groupName, mediaItems, getFormattedMedia, getMediaTypeStats, getMediaTypeLabel }) => {
  const formattedMedia = getFormattedMedia({ [groupName]: mediaItems });
  
  // Skip empty groups
  if (formattedMedia.length === 0) return null;
  
  // Get media type statistics
  const mediaTypeStats = getMediaTypeStats(formattedMedia);
  
  return (
    <section key={groupName} className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
          {groupName.replace(/-/g, ' ').replace(/_/g, ' ')}
        </h2>
        {Object.keys(mediaTypeStats).length > 0 && (
          <p className="text-muted-foreground text-sm sm:text-base mb-2">
            {Object.entries(mediaTypeStats)
              .map(([type, count]) => `${count} ${getMediaTypeLabel(type)}${count > 1 ? 's' : ''}`)
              .join(' • ')}
          </p>
        )}
        <div className="w-24 h-1 bg-gradient-to-r from-primary/50 to-primary mx-auto rounded-full"></div>
      </div>
      
      {/* Enhanced Media Grid with Adaptive Layout */}
      <MediaGrid
        media={formattedMedia}
        enableLazyLoading={true}
        showMetadata={true}
        adaptiveLayout={true}
        className="w-full"
      />
    </section>
  );
};

export default function ProjectPage({ params }) {
  const { slug } = params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    const getProject = async () => {
      try {
        const res = await fetch(`/api/work/${slug}`);
        if (!res.ok) {
          console.error('API Error:', res.status, res.statusText);
          setProject(null);
          return;
        }
        const data = await res.json();
        console.log('Project data received:', data);
        
        // Manually create groupedMedia if it doesn't exist
        if (data && data.media && !data.groupedMedia) {
          data.groupedMedia = {
            'All Media': data.media
          };
        }
        
        setProject(data);
        
        // Set the first group as active by default
        if (data.groupedMedia) {
          const firstGroup = Object.keys(data.groupedMedia)[0];
          setActiveGroup(firstGroup);
        }
      } catch (error) {
        console.error('Failed to fetch project details:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getProject();
    }
  }, [slug]);

  // Helper functions
  const getFormattedMedia = (groupedMedia) => {
    if (!groupedMedia) return [];
    
    return Object.entries(groupedMedia).flatMap(([groupName, items]) => {
      return items.map(item => ({
        ...item,
        group: groupName
      }));
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getMediaTypeStats = (mediaItems) => {
    if (!mediaItems || mediaItems.length === 0) return {};
    
    return mediaItems.reduce((stats, item) => {
      const type = item.type || 'unknown';
      stats[type] = (stats[type] || 0) + 1;
      return stats;
    }, {});
  };

  const getMediaTypeLabel = (type) => {
    switch (type) {
      case MEDIA_TYPES.MOBILE_MOCKUP:
        return 'Mobile Mockup';
      case MEDIA_TYPES.DESKTOP_MOCKUP:
        return 'Desktop Mockup';
      case MEDIA_TYPES.VIDEO:
        return 'Video';
      case MEDIA_TYPES.GRAPHIC:
        return 'Graphic';
      case MEDIA_TYPES.PDF:
        return 'PDF';
      default:
        return 'Image';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading project...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h2>
            <p className="text-muted-foreground mb-8">The project you are looking for does not exist.</p>
            <Link 
              href="/work" 
              className="inline-flex items-center gap-2 btn-primary-enhanced px-6 py-3 rounded-lg"
            >
              <ChevronLeft size={16} />
              Back to All Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isVideoProject = project.category === 'Video Motion Graphics' || slug === 'video-motion-graphics';
  const groupNames = Object.keys(project.groupedMedia);
  const activeGroupMedia = activeGroup ? project.groupedMedia[activeGroup] : [];
  const formattedActiveMedia = getFormattedMedia({ [activeGroup]: activeGroupMedia });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Navigation */}
        <Link 
          href="/work" 
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-8 transition-colors group"
        >
          <ChevronLeft size={16} className="mr-1 transition-transform group-hover:-translate-x-1" />
          Back to All Projects
        </Link>
        
        {/* Project Header */}
        <ProjectHeader project={project} isVideoProject={isVideoProject} />
        
        {/* Project Stats */}
        <ProjectStats 
          project={project} 
          isVideoProject={isVideoProject} 
          activeGroupMedia={activeGroupMedia}
          getMediaTypeStats={getMediaTypeStats}
          getMediaTypeLabel={getMediaTypeLabel}
        />

        <div className="my-8 md:my-12 border-b border-border/50" />

        {/* Group Navigation */}
        <GroupNavigation 
          groupNames={groupNames}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
          project={project}
        />

        {/* Media Sections */}
        <div className="space-y-12 md:space-y-16">
          {isVideoProject ? (
            activeGroup && (
              <VideoProjectSection 
                activeGroup={activeGroup}
                activeGroupMedia={activeGroupMedia}
                formattedActiveMedia={formattedActiveMedia}
              />
            )
          ) : (
            // For regular projects, show only the active group
            activeGroup && project.groupedMedia[activeGroup] && (
              <RegularProjectSection 
                key={activeGroup}
                groupName={activeGroup}
                mediaItems={project.groupedMedia[activeGroup]}
                getFormattedMedia={getFormattedMedia}
                getMediaTypeStats={getMediaTypeStats}
                getMediaTypeLabel={getMediaTypeLabel}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
