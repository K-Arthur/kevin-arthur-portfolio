'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getThumbnailUrl } from '@/lib/cloudinaryUtils';

const WorkClientPage = ({ categorizedProjects }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchTerm) {
      return categorizedProjects;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return categorizedProjects
      .map(category => {
        const filtered = category.projects.filter(
          project =>
            project.title.toLowerCase().includes(lowercasedFilter) ||
            project.tags.some(tag => tag.toLowerCase().includes(lowercasedFilter)) ||
            project.description.toLowerCase().includes(lowercasedFilter)
        );
        return { ...category, projects: filtered };
      })
      .filter(category => category.projects.length > 0);
  }, [searchTerm, categorizedProjects]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My Work
        </motion.h1>
        <motion.p 
          className="max-w-3xl mx-auto text-muted-foreground text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A curated collection of my projects across UI/UX, branding, and motion graphics.
        </motion.p>
        
        {/* Search and Filter */}
        <div className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-16">
        {filteredProjects.map((category) => (
          <motion.div 
            key={category.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 pb-2 border-b-2 border-primary/20">
              {category.name}
            </h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              layout
            >
              {category.projects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  layout
                >
                  <Link href={`/work/${project.slug}`}>
                    <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20 transform group-hover:scale-105 h-full flex flex-col">
                      {/* Project Image */}
                      <div className="relative aspect-[4/3] overflow-hidden w-full">
                        <Image
                          src={getThumbnailUrl(project.heroAsset || {})}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          placeholder={project.heroAsset?.blurPlaceholder ? 'blur' : 'empty'}
                          blurDataURL={project.heroAsset?.blurPlaceholder}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.png';
                          }}
                        />
                        
                        {/* Video indicator */}
                        {(project.hasVideos || project.category === 'Video & Motion Graphics') && (
                          <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                            {project.mediaCount || project.media?.length || 0} items
                          </div>
                        )}
                      </div>

                      {/* Project Info */}
                      <div className="p-5 bg-card flex-grow flex flex-col">
                        <h3 className="text-lg font-semibold text-foreground mb-2 truncate">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-grow">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.tags.slice(0, 3).map(tag => (
                            <div key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded-full">
                              {tag}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkClientPage;
