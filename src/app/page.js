'use client';

import { motion } from 'framer-motion';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import { FaArrowRight, FaEnvelope, FaLinkedin, FaCalendarAlt } from 'react-icons/fa';
import Parallax from '@/components/Parallax';
import MagneticButton from '@/components/MagneticButton';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { MagneticText } from '@/components/ui/morphing-cursor';
import Footer from '@/components/Footer';

const ShaderAnimation = dynamic(() => import('@/components/ui/shader-animation').then(mod => mod.ShaderAnimation), {
  ssr: false
});

// Lazy load 3D Scene component with no SSR
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <SceneLoadingFallback />
});

// Lightweight loading fallback
function SceneLoadingFallback() {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse"
      aria-hidden="true" />
  );
}

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: { type: 'spring', stiffness: 350, damping: 25 }
  },
  tap: { scale: 0.98 }
};


export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [shouldLoadScene, setShouldLoadScene] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Delay 3D scene loading until critical content is rendered
    const timer = setTimeout(() => {
      setShouldLoadScene(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center flex-grow py-20 md:py-32 overflow-hidden">
        {isClient && shouldLoadScene && (
          <Suspense fallback={<SceneLoadingFallback />}>
            <Scene />
          </Suspense>
        )}

        <div className="relative z-10 container-responsive space-y-12">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Hey, I'm{" "}
              <span className="gradient-text-brand inline-block">
                Kevin!
              </span>{" "}
              <span className="inline-block animate-wave">👋</span>
            </motion.h1>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                <span className="block">I design scalable systems that bridge</span>
                <span className="text-primary block">complex AI and human intuition.</span>
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light">
                Product Designer specializing in data-heavy SaaS platforms and design systems.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 w-full sm:w-auto"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MagneticButton
              href="/case-studies"
              strength={0.3}
              className="group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-interactive btn-glow font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <span>View My Work</span>
              <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              href="/contact#schedule"
              strength={0.25}
              className="group inline-flex items-center justify-center gap-2 btn-secondary-enhanced btn-interactive font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Book a Quick Chat</span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Quick Contact Section */}
      <section className="py-20 md:py-32 bg-card/20" aria-labelledby="quick-contact-heading">
        <div className="container-responsive text-center">
          <Parallax offset={20}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 id="quick-contact-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-4 flex flex-col items-center gap-1">
                <span className="block">Ready to</span>
                <MagneticText 
                  text="connect and create" 
                  hoverText="collaborate & innovate" 
                  ariaLabel="Ready to connect and create something amazing together. Hover to reveal: collaborate and innovate"
                />
                <span className="block">
                  something <span className="text-primary">amazing together</span>
                </span>
              </h2>
              <p className="text-lg text-muted-enhanced max-w-2xl mx-auto mb-10">
                I'm always excited to discuss new projects and opportunities.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto px-4 sm:px-0"
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              {/* Email Card */}
              <motion.a
                href="mailto:hello@kevinarthur.design"
                className="card-enhanced group p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center no-underline"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-primary/10 p-3 sm:p-4 rounded-full mb-4">
                    <FaEnvelope className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Email Me</h3>
                  <p className="text-muted-enhanced mb-4 text-sm sm:text-base">hello@kevinarthur.design</p>
                  <span className="font-semibold text-primary group-hover:underline">
                    Send a message
                  </span>
                </div>
              </motion.a>

              {/* LinkedIn Card */}
              <motion.a
                href="https://www.linkedin.com/in/kevinoarthur/"
                target="_blank"
                rel="noopener noreferrer"
                className="card-enhanced group p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center no-underline"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-primary/10 p-3 sm:p-4 rounded-full mb-4">
                    <FaLinkedin className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Kevin Arthur</h3>
                  <p className="text-muted-enhanced mb-4 text-sm sm:text-base">Connect professionally</p>
                  <span className="font-semibold text-primary group-hover:underline">
                    View my profile
                  </span>
                </div>
              </motion.a>
            </motion.div>
          </Parallax>
        </div>
      </section>

      {/* Call to Action Section with Shader + Footer Wrapper */}
      <section className="relative overflow-hidden" aria-labelledby="cta-heading">
        {/* Shader animation background layer - spans CTA and Footer */}
        {isClient && (
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-10 light:opacity-5 pointer-events-none">
            <ShaderAnimation />
          </div>
        )}

        {/* CTA Content */}
        <div className="py-20 md:py-32">
          <div className="container-responsive text-center relative z-10">
            <motion.h2
              id="cta-heading"
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to <span className="text-primary">Transform Your</span> Digital Experience?
            </motion.h2>
            <motion.p
              className="text-lg text-muted-enhanced max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Let's discuss and explore how strategic design can help you achieve your goals.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 flex-wrap w-full sm:w-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <MagneticButton
                href="/contact"
                strength={0.3}
                className="group inline-flex items-center justify-center gap-2 btn-primary-enhanced btn-interactive btn-glow font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
              >
                <span>Start a Project</span>
                <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton
                href="/contact#schedule"
                strength={0.25}
                className="group inline-flex items-center justify-center gap-2 btn-secondary-enhanced btn-interactive font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
              >
                <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Book a 15-Min Call</span>
              </MagneticButton>
              <MagneticButton
                href="/case-studies"
                strength={0.2}
                className="group inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-primary font-medium px-6 py-3.5 sm:px-6 sm:py-4 text-base rounded-xl link-animated w-full sm:w-auto min-h-[52px]"
              >
                <span>See Case Studies</span>
                <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </motion.div>
          </div>
        </div>

        {/* Footer inside shader wrapper */}
        <Footer transparent />
      </section>
    </div>
  );
}