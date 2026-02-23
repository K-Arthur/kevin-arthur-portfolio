'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight, FaExternalLinkAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { personalInfo } from '@/data/portfolio-data';
import { getContextualMessage, formatSourceName } from '@/data/contact-config';
import { HandWrittenTitle } from '@/components/ui/hand-writing-text';
import dynamic from 'next/dynamic';

// Defer the heavy background component
const InfiniteGridBackground = dynamic(
  () => import('@/components/ui/the-infinite-grid').then((mod) => mod.InfiniteGridBackground)
);

// Lazy load scroll animation components
const ScrollRevealContainer = dynamic(
  () => import('@/components/ui/ScrollRevealContainer').then(mod => mod.default),
  { ssr: false }
);
const ScrollRevealItem = dynamic(
  () => import('@/components/ui/ScrollRevealContainer').then(mod => mod.ScrollRevealItem),
  { ssr: false }
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
    href: 'https://calendly.com/arthurkevin27/15min',
    primary: true,
    external: true,
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

const ContactContent = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');
  const [source, setSource] = useState(null);

  useEffect(() => {
    const plan = searchParams.get('plan');
    const billing = searchParams.get('billing');
    const sourceParam = searchParams.get('source');
    const caseStudyId = searchParams.get('case');

    // Set source for display
    if (sourceParam) {
      setSource(sourceParam);
    }

    // Generate contextual message using centralized config
    const contextualMessage = getContextualMessage({
      source: sourceParam,
      plan,
      billing,
      caseStudyId
    });

    if (contextualMessage) {
      setMessage(contextualMessage);
    }
  }, [searchParams]);

  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    const form = e.target;
    const formData = new FormData(form);

    try {
      // Using Formspree - form endpoint configured
      const response = await fetch('https://formspree.io/f/xojnpqrv', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
    }
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
            title="Let&apos;s Create Something"
            highlightedText="Amazing Together"
            subtitle="Ready to bring your vision to life? Book a quick call or send me a message — I&apos;d love to hear about your project."
          />
        </div>

        {/* Quick Actions - Prominent Scheduling */}
        <h2 className="sr-only">Ways to Connect</h2>
        <ScrollRevealContainer
          variant="scaleUp"
          staggerChildren={0.15}
          className="grid sm:grid-cols-3 gap-4 md:gap-6"
        >
          {quickActions.map((action, index) => (
            <ScrollRevealItem key={index} className="h-full">
              <a
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                className={`group card-enhanced p-6 h-full flex flex-col items-center text-center no-underline transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-xl ${action.primary
                  ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 border-primary/30'
                  : ''
                  }`}
              >
                <div className={`p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 ${action.primary ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  <span className="text-primary">{action.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {action.label}
                </h3>
                <p className="text-sm text-muted-foreground flex-1">{action.description}</p>
                <span className={`inline-flex items-center gap-2 font-medium text-sm mt-4 ${action.primary ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                  {action.primary ? 'Schedule now' : action.external ? 'Open profile' : 'Send email'}
                  <FaArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </ScrollRevealItem>
          ))}
        </ScrollRevealContainer>

        <ScrollRevealContainer
          variant="slideUp"
          className="grid lg:grid-cols-2 gap-16"
        >
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I&apos;m currently available for new projects and collaborations.
                Whether you have a specific idea in mind or just want to explore possibilities,
                I&apos;d love to hear from you.
              </p>
            </div>

            {/* Contact Info Cards */}
            <ScrollRevealContainer
              variant="slideRight"
              staggerChildren={0.1}
              className="space-y-4"
            >
              {contactInfo.map((info, index) => (
                <ScrollRevealItem
                  key={index}
                  className="card-base flex items-center p-4 rounded-xl hover:bg-card/50 transition-all duration-300 hover:scale-[1.02] hover:translate-x-2 hover:shadow-lg group cursor-default"
                >
                  <div className="text-primary text-2xl mr-4 transition-transform duration-300 group-hover:scale-110">{info.icon}</div>
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
                </ScrollRevealItem>
              ))}
            </ScrollRevealContainer>
          </div>

          {/* Contact Form */}
          <div className="card-base p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Send Me a Message</h2>
              <p className="text-muted-foreground">
                Prefer to write? No problem. Tell me about your project and I&apos;ll get back to you within 24 hours.
              </p>
            </div>

            {formStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center">
                <FaCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
              </div>
            )}

            {formStatus === 'error' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                <FaExclamationCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-destructive text-sm">
                  There was an error sending your message. Please try again or email me directly at{' '}
                  <a href="mailto:hello@kevinarthur.design" className="underline">hello@kevinarthur.design</a>
                </p>
              </div>
            )}

            {formStatus !== 'success' && (
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                  placeholder="Tell me about your project, goals, and how I can help you achieve them..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full bg-primary text-primary-foreground py-4 px-8 rounded-xl text-lg font-semibold hover:bg-primary/90 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formStatus === 'submitting' ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
            )}
          </div>
        </ScrollRevealContainer>
      </div>
    </div>
  );
};

const ContactPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <ContactContent />
  </Suspense>
);

export default ContactPage;
