'use client';

import { FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { personalInfo } from '@/data/portfolio-data';
import { HandWrittenTitle } from '@/components/ui/hand-writing-text';
import dynamic from 'next/dynamic';

// Defer the heavy background component
const InfiniteGridBackground = dynamic(
  () => import('@/components/ui/the-infinite-grid').then((mod) => mod.InfiniteGridBackground)
);

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
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Layer - Loaded Async */}
      <div className="absolute inset-0 z-0">
        <InfiniteGridBackground
          className="min-h-screen"
          gridSize={50}
          speedX={0.25}
          speedY={0.2}
          revealRadius={350}
          baseOpacity={0.04}
          revealOpacity={0.45}
          fullPage={true}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-16 px-6 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-24">
        {/* Hero Section */}
        <div className="animate-fade-in-up">
          <HandWrittenTitle
            title="Let's Create Something"
            highlightedText="Amazing Together"
            subtitle="Ready to bring your vision to life? Book a quick call or send me a message — I'd love to hear about your project."
          />
        </div>

        {/* Quick Actions - Prominent Scheduling */}
        <h2 className="sr-only">Ways to Connect</h2>
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 animate-fade-in-up animation-delay-200">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              className={`group card-enhanced p-6 flex flex-col items-center text-center no-underline transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-1 ${action.primary
                ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 border-primary/30'
                : ''
                }`}
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
            </a>
          ))}
        </div>

        {/* Scheduling Section Placeholder */}
        <section
          id="schedule"
          className="scroll-mt-24 animate-fade-in-up animation-delay-400"
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
              <div className="mt-8 p-1">
                <div className="relative group overflow-hidden rounded-2xl border border-primary/20 bg-background/50 hover:bg-background/80 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaCalendarAlt className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-bold">Book Your Free 15-Minute Intro</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Secure your spot directly on my calendar. We'll meet via Google Meet to discuss your vision.
                      </p>
                    </div>
                    <a
                      href="https://calendly.com/arthurkevin27/15min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                    >
                      Open Scheduling Page
                      <FaExternalLinkAlt className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-16 animate-fade-in-up animation-delay-600">
          {/* Contact Information */}
          <div className="space-y-8">
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
                <div
                  key={index}
                  className="card-base flex items-center p-4 rounded-xl hover:bg-card/50 transition-transform duration-200 hover:scale-[1.02]"
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
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-base p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Send Me a Message</h2>
              <p className="text-muted-foreground">
                Prefer to write? No problem. Tell me about your project and I'll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
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
                </div>

                <div>
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
                </div>
              </div>

              <div>
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
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 px-8 rounded-xl text-lg font-semibold hover:bg-primary/90 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
