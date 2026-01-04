'use client';

import { motion } from 'framer-motion';
import { FaLinkedin, FaBehanceSquare, FaEnvelope, FaPaperPlane, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { personalInfo } from '@/data/portfolio-data';

const contactInfo = [
  { label: 'Email', value: personalInfo.email, icon: <FaEnvelope /> },
  { label: 'Phone', value: personalInfo.phone, icon: <FaPhone /> },
  { label: 'Location', value: personalInfo.location, icon: <FaMapMarkerAlt /> },
];

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here.
    alert('Thank you for your message! This is a demo form.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 px-6 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-24">
      {/* Hero Section */}
      <Parallax offset={-20}>
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Let's Create Something
            <span className="block text-primary">Amazing Together</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to bring your vision to life? I'm here to help you create exceptional digital experiences that make an impact.
          </p>
        </motion.div>
      </Parallax>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Contact Information */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
                  <p className="text-foreground font-medium">{info.value}</p>
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
              Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
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
  );
};

export default ContactPage;