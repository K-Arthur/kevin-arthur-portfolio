'use client';

import { motion } from 'framer-motion';
import { FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { personalInfo } from '@/data/portfolio-data';
import Parallax from '@/components/Parallax';
import { HandWrittenTitle } from '@/components/ui/hand-writing-text';
import { InfiniteGridBackground } from '@/components/ui/the-infinite-grid';

const contactInfo = [
  { label: 'Email', value: personalInfo.email, icon: <FaEnvelope />, href: `mailto:${personalInfo.email}` },
  { label: 'Phone', value: personalInfo.phone, icon: <FaPhone />, href: `tel:${personalInfo.phone}` },
  { label: 'Location', value: personalInfo.location, icon: <FaMapMarkerAlt />, href: null },
];

const quickActions = [
  {
    label: 'Book a 15-Min Call',
    description: 'No pitch, just conversation. Let\'s discuss your project together.',
    icon: <FaCalendarAlt className="w-6 h-6" />,
    href: '#schedule',
    primary: true,
  },
  {
    label: 'Send an Email',
    description: 'hello@kevinarthur.design',
    icon: <FaEnvelope className="w-6 h-6" />,
    href: 'mailto:hello@kevinarthur.design',
    primary: false,
  },
  {
    label: 'Connect on LinkedIn',
    description: 'Let\'s connect professionally',
    icon: <FaLinkedin className="w-6 h-6" />,
    href: 'https://www.linkedin.com/in/kevinoarthur/',
    primary: false,
    external: true,
  },
];

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here.
    alert('Thank you for your message! This is a demo form.');
  };

  return (
    <InfiniteGridBackground 
      className="min-h-screen"
      gridSize={50}
      speedX={0.25}
      speedY={0.2}
      revealRadius={350}
      baseOpacity={0.04}
      revealOpacity={0.45}
      fullPage={true}
    >
      <div className="max-w-6xl mx-auto space-y-16 px-6 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-24">
        {/* Hero Section */}
        <Parallax offset={-20}>
        <HandWrittenTitle
          title="Let's Create Something"
          highlightedText="Amazing Together"
          subtitle="Ready to bring your vision to life? Book a quick call or send me a message — I'd love to hear about your project."
        />
      </Parallax>

      {/* Quick Actions - Prominent Scheduling */}
      <motion.div
        className="grid sm:grid-cols-3 gap-4 md:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {quickActions.map((action, index) => (
          <motion.a
            key={index}
            href={action.href}
            target={action.external ? '_blank' : undefined}
            rel={action.external ? 'noopener noreferrer' : undefined}
            className={`group card-enhanced p-6 flex flex-col items-center text-center no-underline ${action.primary
              ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 border-primary/30'
              : ''
              }`}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className={`p-4 rounded-full mb-4 ${action.primary ? 'bg-primary/20' : 'bg-primary/10'}`}>
              <span className="text-primary">{action.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {action.label}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
            {action.primary && (
              <span className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                Schedule now
                <FaArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            )}
          </motion.a>
        ))}
      </motion.div>

      {/* Scheduling Section Placeholder */}
      <motion.section
        id="schedule"
        className="scroll-mt-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="card-enhanced p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <FaCalendarAlt className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Schedule a 15-Minute Intro Call
            </h2>
            <p className="text-muted-foreground text-lg">
              Pick a time that works for you. We'll discuss your project, goals, and explore if we're a good fit — no strings attached.
            </p>
            {/* Calendly Embed */}
            <div className="mt-6 rounded-xl overflow-hidden border border-border/30">
              <iframe
                src="https://calendly.com/arthurkevin27/15min?embed=true&hide_gdpr_banner=1"
                className="w-full h-[650px] border-0"
                title="Schedule a 15-minute intro call with Kevin Arthur"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Contact Information */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm currently available for new projects and collaborations.
              Whether you have a specific idea in mind or just want to explore possibilities,
              I'd love to hear from you.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="card-base flex items-center p-4 rounded-xl hover:bg-card/50"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-primary text-2xl mr-4">{info.icon}</div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} className="text-foreground font-medium hover:text-primary transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-foreground font-medium">{info.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="card-base p-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Send Me a Message</h2>
            <p className="text-muted-foreground">
              Prefer to write? No problem. Tell me about your project and I'll get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                  placeholder="Your full name"
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                  placeholder="your.email@example.com"
                />
              </motion.div>
            </div>

            <motion.div
              whileFocus={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                required
                className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                placeholder="Tell me about your project, goals, and how I can help you achieve them..."
              ></textarea>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 px-8 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
      </div>
    </InfiniteGridBackground>
  );
};

export default ContactPage;