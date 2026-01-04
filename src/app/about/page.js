'use client';

import { motion } from 'framer-motion';
import { personalInfo, skills, education, professionalExperience } from '@/data/portfolio-data';
import { FaBriefcase, FaGraduationCap, FaTools } from 'react-icons/fa';
import { useState } from 'react';

const Section = ({ children, delay = 0 }) => (
  <motion.section 
    initial={{ opacity: 1, y: 0 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', damping: 15, stiffness: 100, duration: 0.5, delay }}
  >
    {children}
  </motion.section>
);

const SectionTitle = ({ icon, children }) => (
  <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
    <span className="text-primary">{icon}</span>
    {children}
  </h2>
);

import Image from 'next/image';

const SkillsSection = () => {
  const [activeTab, setActiveTab] = useState(Object.keys(skills)[0]);

  return (
    <Section delay={0.2}>
      <SectionTitle icon={<FaTools />}>Skills & Tools</SectionTitle>
      <div className="flex justify-center mb-8 -mx-6 sm:mx-0">
        <div className="bg-muted/50 p-1.5 rounded-full flex gap-2 overflow-x-auto px-4">
          {Object.keys(skills).map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base font-semibold rounded-full transition-colors duration-300 relative
                ${activeTab === category ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-card/70 hover:text-foreground'}`}
            >
              {activeTab === category && (
                <motion.div
                  layoutId="activeSkillTab"
                  className="absolute inset-0 bg-primary/90 rounded-full"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {skills[activeTab].map((skill, index) => (
          <motion.div
            key={`${activeTab}-${index}`}
            className="card-enhanced flex flex-col items-center justify-center p-4 md:p-6 bg-card/50 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', damping: 15, stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          >
            <div className="text-4xl text-primary mb-3">{skill.icon}</div>
            <span className="text-base md:text-lg text-foreground text-center">{skill.name}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          <div className="lg:col-span-2 space-y-8">
            <Parallax offset={-20}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                  A bit more
                  <span className="block text-primary">about me</span>
                </h1>
                <div className="space-y-6 text-lg leading-relaxed text-muted-enhanced">
                  <p className="text-xl leading-relaxed">
                    {personalInfo.summary}
                  </p>
                  <p className="text-lg leading-relaxed border-l-4 border-primary/30 pl-6 bg-card/20 py-4 rounded-r-xl">
                    I believe great design happens when strategy meets creativity. Every project I take on 
                    is an opportunity to solve real problems and create meaningful impact through thoughtful, 
                    user-centered design.
                  </p>
                </div>
              </motion.div>
            </Parallax>
          </div>
          <Parallax offset={30} className="w-full">
            <motion.div 
              className="relative w-full h-96 md:h-[30rem] lg:h-96 md:max-w-sm lg:max-w-none md:mx-auto lg:mx-0 group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.03, rotate: -2 }}
            >
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
                animate={{ 
                  y: [0, -10, 0], 
                  x: [0, 5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              ></motion.div>
              <motion.div
                className="absolute -top-8 -left-8 w-28 h-28 bg-secondary/10 rounded-full blur-3xl"
                animate={{ 
                  y: [0, 10, 0], 
                  x: [0, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1 }}
              ></motion.div>
              
              <div className="relative card-enhanced h-full w-full bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 p-2 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10 rounded-3xl">
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-300"></div>
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                    src="/images/profile-image.jpg"
                alt="Kevin Arthur"
                fill
                    className="object-cover object-top lg:object-center transition-transform duration-500 group-hover:scale-105"
                priority
              />
                </div>
              </div>
            </motion.div>
          </Parallax>
        </div>
      </Section>

      {/* What Sets Me Apart Section */}
      <Section delay={0.1}>
        <div className="rounded-2xl border border-border/20 bg-card/20 p-8 backdrop-blur-sm transition-colors duration-300">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
            How I Approach My Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Strategic Thinking', text: "I don't just design pixels. I align every decision with user needs and business goals to create solutions that deliver real, measurable impact." },
              { icon: '⚡', title: 'Speed & Efficiency', text: 'Leveraging lean design principles and rapid prototyping, I accelerate the journey from concept to launch without compromising quality.' },
              { icon: '🔄', title: 'Continuous Learning', text: "The digital landscape is always evolving, and so am I. I'm committed to mastering new tools and technologies to keep your product ahead of the curve." },
              { icon: '🤝', title: 'Radical Collaboration', text: "The best ideas emerge when we work together. I foster a collaborative environment where every voice is heard to build solutions that truly resonate." },
            ].map((item, index) => (
              <div key={index} className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1.5">
                <h3 className="text-4xl mb-4">{item.icon}</h3>
                <h4 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
                <p className="text-muted-enhanced text-sm leading-relaxed max-w-xs mx-auto">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <SkillsSection />

      <Section delay={0.4}>
        <SectionTitle icon={<FaBriefcase />}>My Journey So Far</SectionTitle>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-32 md:left-40 top-0 bottom-0 w-0.5 bg-border/40"></div>
          
          <div className="space-y-8 md:space-y-12">
            {professionalExperience.map((job, index) => (
              <motion.div
                key={index} 
                className="relative flex items-start gap-4 md:gap-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-32 md:left-40 top-2 w-3 h-3 md:w-4 md:h-4 bg-background border-2 border-primary rounded-full transform -translate-x-1/2 z-10"></div>
                
                <div className="w-28 md:w-36 text-right text-xs md:text-sm font-medium text-muted-enhanced shrink-0 pt-2">
                  {job.period.split(' - ').map((part, i) => (
                    <span key={i} className="block whitespace-nowrap">{part}</span>
                  ))}
                </div>
                
                <div className="flex-grow card-enhanced bg-card/80 p-4 md:p-6 rounded-lg ml-4 md:ml-8">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">{job.role}</h3>
                  <p className="text-primary font-semibold mb-2 text-sm md:text-base">{job.company}</p>
                  <p className="text-muted-enhanced text-sm md:text-base leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section delay={0.6}>
        <SectionTitle icon={<FaGraduationCap />}>Education</SectionTitle>
        <div className="space-y-8">
          {education.map((edu, index) => (
            <div key={index} className="card-enhanced p-4 md:p-6 bg-card/50 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-foreground">{edu.degree}</h3>
              {edu.specialization && <p className="text-md font-medium text-primary">{edu.specialization}</p>}
              <p className="text-md text-muted-enhanced mt-1">{edu.institution}</p>
              <p className="text-sm text-muted-enhanced">{edu.period}</p>
              {edu.details && (
                <ul className="mt-3 list-disc list-inside space-y-1 text-muted-enhanced prose-sm">
                  {edu.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default AboutPage;