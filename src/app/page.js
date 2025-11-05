'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Scene from '@/components/Scene';
import { FaArrowRight, FaEnvelope, FaLinkedin } from 'react-icons/fa';

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
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center flex-grow py-20 md:py-32 overflow-hidden">
        <Scene />

        <div className="relative z-10 container-responsive space-y-12">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                <span className="block">I design digital experiences</span>
                <span className="text-primary block">that people actually want to use.</span>
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-enhanced max-w-3xl mx-auto leading-relaxed font-light">
                Product & UI/UX Designer turning complex problems into simple, 
                beautiful solutions that drive real results.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              href="/case-studies" 
              className="group inline-flex items-center justify-center gap-3 btn-primary-enhanced font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              View My Work
              <FaArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/about" 
              className="group inline-flex items-center justify-center gap-3 btn-secondary-enhanced font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              About Me
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Quick Contact Section */}
      <section className="py-20 md:py-32 bg-card/20" aria-labelledby="quick-contact-heading">
        <div className="container-responsive text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 id="quick-contact-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Let's connect and create
              <br/> 
              something <span className="text-primary">amazing together</span>
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
              <div className="bg-primary/10 p-3 sm:p-4 rounded-full mb-4">
                <FaEnvelope className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Email Me</h3>
              <p className="text-muted-enhanced mb-4 text-sm sm:text-base">hello@kevinarthur.design</p>
              <span className="font-semibold text-primary group-hover:underline">
                Send a message
              </span>
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
              <div className="bg-primary/10 p-3 sm:p-4 rounded-full mb-4">
                <FaLinkedin className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Kevin Arthur</h3>
              <p className="text-muted-enhanced mb-4 text-sm sm:text-base">Connect professionally</p>
              <span className="font-semibold text-primary group-hover:underline">
                View my profile
              </span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32" aria-labelledby="cta-heading">
        <div className="container-responsive text-center">
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
            className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/contact" className="group inline-flex items-center justify-center gap-3 btn-primary-enhanced font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
              Start a Project
              <FaArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/case-studies" className="group inline-flex items-center justify-center gap-3 btn-secondary-enhanced font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
              See Case Studies
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}