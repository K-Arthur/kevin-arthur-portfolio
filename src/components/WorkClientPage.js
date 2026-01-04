'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaCode, FaFigma } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getThumbnailUrl } from '@/lib/cloudinaryUtils';

const WorkClientPage = ({ projects: categorizedProjects }) => {
  // We only have one category now (Case Studies)
  const caseStudies = categorizedProjects[0]?.projects || [];


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-24">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6 p-3 bg-primary/10 rounded-xl border border-primary/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaCode className="text-primary text-xl" />
            <span className="text-primary font-medium">UI Engineering</span>
          </motion.div>
          
          <motion.h1 
            className="font-bold tracking-tight mb-6 gradient-text-enhanced text-4xl sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Case Studies
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Selected projects showcasing my expertise in building beautiful, 
            accessible, and performant user interfaces with React and modern web technologies.
          </motion.p>
        </motion.div>

        {/* Case Studies Grid */}
        <motion.div 
          className="grid grid-cols-1 gap-16 max-w-4xl mx-auto"
          layout
        >
          {caseStudies.map((project, index) => (
            <motion.article
              key={project.slug}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/work/${project.slug}`} className="block">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-video bg-muted/20 border border-border/30">
                  <Image
                    src={getThumbnailUrl(project.thumbnail, 1200, 800, 'fill', 'crop')}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                      <FaFigma className="text-foreground/60" />
                      <span>View Case Study</span>
                    </div>
                    
                    {/* Video indicator */}
                    {(project.hasVideos || project.category === 'Video & Motion Graphics') && (
                      <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        {project.mediaCount || project.media?.length || 0} Videos
                      </div>
                    )}
                  </div>
                  
                  {/* Project Info */}
                  <div className="p-4 sm:p-6 flex-grow flex flex-col justify-end bg-card/60">
                    <div>
                      <h3 className="text-foreground text-xl font-bold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {project.category}
                      </p>
                      <div className="flex items-center gap-2 text-primary text-sm font-medium transition-opacity duration-300">
                        <span>View Project</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Border Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
        
        {/* Empty State */}
        {caseStudies.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-enhanced">Try selecting a different category to view more projects.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WorkClientPage;
