'use client';

import { FaLinkedin, FaBehanceSquare } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import FooterLeadMagnet from './FooterLeadMagnet';

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/kevinoarthur/',
    label: 'LinkedIn',
    icon: FaLinkedin,
  },
  {
    href: 'https://www.behance.net/arthurkevin',
    label: 'Behance',
    icon: FaBehanceSquare,
  },
];

const Footer = ({ transparent = false, showLeadMagnet = true }) => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide the global footer on homepage since it has its own inline footer with shader
  if (!transparent && pathname === '/') {
    return null;
  }

  // Don't show lead magnet on lab page (already has them) or contact page
  const hideLeadMagnet = pathname === '/lab' || pathname === '/contact';

  // Calculate min-height based on what's shown
  // Without lead magnet: ~120px, with lead magnet: ~280px
  const footerMinHeight = (showLeadMagnet && !hideLeadMagnet && !transparent) ? 'min-h-[280px]' : 'min-h-[120px]';

  return (
    <footer
      className={`${transparent ? 'bg-transparent border-t-0 mt-0 relative z-10' : 'glass-premium border-t border-border/50 mt-24'} ${footerMinHeight}`}
      aria-label="Footer"
      style={{ contain: 'layout' }}
    >
      {/* Lead Magnet Section */}
      {showLeadMagnet && !hideLeadMagnet && !transparent && (
        <FooterLeadMagnet />
      )}

      <div className="container-responsive py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Social Links */}
          <nav aria-label="Social media links" className="flex gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                aria-label={link.label}
              >
                <span className="sr-only">{link.label}</span>
                <link.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </nav>

          {/* Copyright & Credits */}
          <p className="text-sm text-muted-foreground text-center">
            &copy; {currentYear} Kevin Arthur. Designed & Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;