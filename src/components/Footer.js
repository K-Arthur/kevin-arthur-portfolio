import { FaLinkedin, FaBehanceSquare } from 'react-icons/fa';

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

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t border-border/50 mt-24" aria-label="Footer">
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