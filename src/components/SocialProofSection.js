'use client';

import Image from 'next/image';
import { FaHandshake } from 'react-icons/fa';

const partnerLogos = [
  { name: 'Nvidia', src: '/images/logos/nvidia.svg', w: 70, h: 18 },
  { name: 'Gates Foundation', src: '/images/logos/Gates_Foundation_Logo.svg', w: 80, h: 26 },
  { name: 'WHO', src: '/images/logos/who.svg', w: 70, h: 32 },
  { name: 'Imperial College', src: '/images/logos/Logo_for_Imperial_College_London.svg', w: 90, h: 24 },
];

export default function SocialProofSection({ className = '' }) {
  return (
    <div className={`${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        {/* Left side - explanation */}
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FaHandshake className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm">
            <span className="font-medium text-foreground">Partnership ecosystem:</span> Worked with organizations backed by or collaborating with
          </p>
        </div>
        
        {/* Right side - logos in a subtle container */}
        <div className="flex items-center gap-4 md:gap-6 px-4 py-2 rounded-full bg-background/50 border border-border/30">
          {partnerLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
              title={logo.name}
            >
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                width={logo.w}
                height={logo.h}
                className="h-4 md:h-5 w-auto object-contain dark:invert"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
