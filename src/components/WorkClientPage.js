'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBriefcase, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const WorkClientPage = ({ projects: categorizedProjects }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const allProjects = categorizedProjects.flatMap(category => category.projects);

  const filteredProjects = activeCategory === 'All'
    ? allProjects
    : categorizedProjects.find(c => c.name === activeCategory)?.projects || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-24">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6 p-4 bg-primary/10 rounded-2xl border border-primary/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaBriefcase className="text-primary text-2xl" />
            <span className="text-primary font-semibold text-lg">Portfolio</span>
          </motion.div>
          
          <motion.h1 
            className="font-bold tracking-tight mb-8 gradient-text-enhanced text-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            My Work
          </motion.h1>
          
          <motion.p 
            className="text-subtitle text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            A curated selection of design projects showcasing my skills in UI/UX, 
            branding, and visual design across various industries.
          </motion.p>
        </motion.div>

        {/* Filter Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <FaFilter className="text-muted-enhanced" />
            <span className="text-muted-enhanced font-medium">Filter by category</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {['All', ...categorizedProjects.map(cat => cat.name)].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 sm:px-6 py-3 rounded-full font-medium transition-all duration-300 min-h-[44px] touch-manipulation ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg transform scale-105'
                    : 'bg-card/60 text-foreground hover:bg-card/80 border border-border/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          layout
        >
          {filteredProjects.map((project, index) => (
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
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Video indicator */}
                    {project.hasVideos && (
                      <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        {project.mediaCount} Videos
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
                  
                  {/* Border Accent - This can be removed if the new design doesn't need it. For now, I'll leave it */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Empty State */}
        {filteredProjects.length === 0 && (
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
