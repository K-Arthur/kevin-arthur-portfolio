'use client';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Each partner has carefully tuned width/height so the logo's *true visual weight*
 * feels balanced — not just its bounding box.
 * 
 * The marquee works by rendering the list twice (first + aria-hidden duplicate)
 * and animating both together so there is always content on screen. Because both
 * strips are identical and rendered in the same flex container the seam is invisible.
 */
const partners = [
    {
        name: 'Nvidia',
        src: '/images/logos/nvidia.svg',
        w: 130, h: 32,
        filter: 'dark:invert',
        hoverFilter: '[filter:brightness(0)_saturate(100%)_invert(58%)_sepia(83%)_saturate(605%)_hue-rotate(48deg)_brightness(101%)_contrast(99%)] dark:[filter:brightness(0)_saturate(100%)_invert(58%)_sepia(83%)_saturate(605%)_hue-rotate(48deg)_brightness(101%)_contrast(99%)]',
    },
    {
        name: 'Gates Foundation',
        src: '/images/logos/Gates_Foundation_Logo.svg',
        w: 150, h: 48,
        filter: 'dark:invert',
    },
    {
        name: 'WHO',
        src: '/images/logos/who.svg',
        w: 130, h: 60,
        filter: 'dark:invert',
    },
    {
        name: 'Imperial College London',
        src: '/images/logos/Logo_for_Imperial_College_London.svg',
        w: 160, h: 42,
        filter: 'dark:invert',
    },
    {
        name: 'BnF',
        src: '/images/logos/Logo_BnF.svg',
        w: 110, h: 48,
        filter: 'dark:invert',
    },
    {
        name: 'IBBY',
        src: '/images/logos/IBBY_logo_clean.svg',
        w: 110, h: 50,
        filter: 'dark:invert',
    },
    {
        name: 'Access Bank',
        src: '/images/logos/Access Bank_idk3XMC1BM_0.svg',
        w: 160, h: 40,
        filter: 'dark:invert',
    },
    {
        name: 'Sistas in Sales',
        src: '/images/logos/SIS-Logo-white-pink-i-logo-mark-e1715918321281-300x181.webp',
        w: 100, h: 56,
        filter: 'brightness-0 dark:brightness-100 dark:invert-0',
    },
    {
        name: 'Goethe-Institut',
        src: '/images/logos/Logo_Goethe_Institut.svg',
        w: 220, h: 44,
        filter: 'dark:invert contrast-125',
    },
    {
        name: 'Tech in Ghana',
        src: '/images/logos/tech_in_ghana_logo.jpeg',
        w: 120, h: 50,
        filter: 'mix-blend-multiply dark:mix-blend-plus-lighter grayscale dark:grayscale-0',
    },
    {
        name: 'BWTT',
        src: '/images/logos/BWTT_logo.webp',
        w: 140, h: 56,
        filter: 'dark:invert',
    },
    {
        name: 'Enpact',
        src: '/images/logos/Enpact_Logo.jpeg',
        w: 180, h: 70,
        filter: 'mix-blend-multiply dark:mix-blend-plus-lighter grayscale dark:grayscale-0',
    },
    {
        name: 'TechSoup',
        src: '/images/logos/techsoup.svg',
        w: 150, h: 48,
        filter: 'dark:invert',
    },
];

function LogoItem({ partner, prefix }) {
    return (
        <div className="flex shrink-0 items-center justify-center px-8 md:px-10">
            <Image
                src={partner.src}
                alt={`${partner.name} logo`}
                width={partner.w}
                height={partner.h}
                className={cn(
                    'object-contain transition-all duration-300 opacity-90 hover:opacity-100',
                    partner.filter,
                    partner.hoverFilter && `hover:${partner.hoverFilter}`
                )}
            />
        </div>
    );
}

export function TrustStrip({ className }) {
    return (
        <div className={cn('w-full py-10 md:py-12 border-t border-b border-border/10 bg-card/10 overflow-hidden', className)}>
            <div className="container-responsive">
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-6 md:mb-8">
                    <p className="text-sm md:text-base text-muted-foreground">
                        <span className="font-medium text-foreground">Partnership ecosystem:</span> Worked with organizations backed by or collaborating with
                    </p>
                </div>

                {/* Marquee: one flex row containing the list twice. CSS animates the whole row left by 50%. */}
                <div className="relative overflow-hidden">
                    {/* Edge fade masks */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 md:w-40 bg-gradient-to-r from-background to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 md:w-40 bg-gradient-to-l from-background to-transparent" />

                    <div className="flex animate-marquee-single whitespace-nowrap opacity-70 grayscale hover:grayscale-0 transition-all py-4">
                        {/* First copy */}
                        {partners.map((partner, i) => (
                            <LogoItem key={`a-${i}`} partner={partner} prefix="a" />
                        ))}
                        {/* Seamless duplicate — aria-hidden so screen readers skip it */}
                        {partners.map((partner, i) => (
                            <LogoItem key={`b-${i}`} partner={partner} prefix="b" aria-hidden="true" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
