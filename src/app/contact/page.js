import { Suspense } from 'react';
import { FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaArrowRight } from 'react-icons/fa';
import { personalInfo, socialProfiles } from '@/data/portfolio-data';
import PageBackdrop from '@/components/PageBackdrop';
import ContactForm from './ContactForm';

export const dynamic = 'force-static';

const contactInfo = [
  { label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
  { label: 'Phone', value: personalInfo.phone, href: `tel:${personalInfo.tel}` },
  { label: 'Location', value: personalInfo.location, href: null },
];

const quickActions = [
  {
    label: 'Get in touch',
    description: 'Open to design engineer and frontend roles.',
    href: 'mailto:hello@kevinarthur.design',
    primary: true,
  },
  {
    label: 'GitHub',
    description: 'github.com/K-Arthur',
    href: socialProfiles.github,
    external: true,
  },
  {
    label: 'Connect on LinkedIn',
    description: "Let's connect professionally",
    href: socialProfiles.linkedin,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <PageBackdrop />

      <div className="relative z-10 max-w-6xl mx-auto space-y-16 px-6 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-24">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Get in touch
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Open to design engineer and frontend roles. Remote in Canada, or Vancouver.
          </p>
        </header>

        <h2 className="sr-only">Ways to Connect</h2>
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
          {quickActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              className={`group card-enhanced p-6 h-full flex flex-col items-center text-center no-underline transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-xl ${
                action.primary
                  ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 border-primary/30'
                  : ''
              }`}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {action.label}
              </h3>
              <p className="text-sm text-muted-foreground flex-1">{action.description}</p>
              <span className={`inline-flex items-center gap-2 font-medium text-sm mt-4 ${action.primary ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                {action.primary ? 'Email me' : 'Open profile'}
                <FaArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Contact</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I&apos;m looking for design engineer and frontend product roles — React, TypeScript, Next.js — and for product designer roles where I also write production code.
              </p>
            </div>

            <ul className="space-y-4">
              {contactInfo.map((info) => (
                <li
                  key={info.label}
                  className="card-base flex items-center p-4 rounded-xl"
                >
                  <div className="text-primary text-2xl mr-4">
                    {info.label === 'Email' && <FaEnvelope />}
                    {info.label === 'Phone' && <FaPhone />}
                    {info.label === 'Location' && <FaMapMarkerAlt />}
                  </div>
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
                </li>
              ))}
              <li className="card-base flex items-center p-4 rounded-xl">
                <div className="text-primary text-2xl mr-4">
                  <FaGithub />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">GitHub</p>
                  <a href={socialProfiles.github} target="_blank" rel="noopener noreferrer" className="text-foreground font-medium hover:text-primary transition-colors">
                    github.com/K-Arthur
                  </a>
                </div>
              </li>
              <li className="card-base flex items-center p-4 rounded-xl">
                <div className="text-primary text-2xl mr-4">
                  <FaLinkedin />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">LinkedIn</p>
                  <a href={socialProfiles.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground font-medium hover:text-primary transition-colors">
                    linkedin.com/in/kevinoarthur
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <Suspense fallback={<div className="card-base p-8 min-h-[28rem]" />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
