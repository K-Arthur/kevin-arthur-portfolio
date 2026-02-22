import './globals.css';
import { Jost, Fira_Code } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { CursorProvider } from '@/components/CursorProvider';
import dynamic from 'next/dynamic';
import { SpeedInsights } from "@vercel/speed-insights/next"
// Note: Using native <script> tags for Partytown scripts instead of next/script
import { personSchema, websiteSchema } from '@/lib/structured-data';

import { PartytownSetup } from '@/components/PartytownSetup';

// Dynamically import WebVitals with no SSR
const WebVitals = dynamic(() => import('@/components/WebVitals'), {
  ssr: false,
});

// Load fonts
const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap'
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap'
});

export const metadata = {
  title: {
    default: 'Kevin Arthur | Design Engineer & AI Interface Design Expert | Vancouver',
    template: '%s | Kevin Arthur Design'
  },
  description: 'Design Engineer and SaaS Product Designer in Vancouver specializing in AI interface design. Case studies: 97% diagnostic accuracy, 500+ healthcare facilities. Expert in healthcare UX and data-heavy platforms.',
  keywords: ['Design Engineer Portfolio', 'SaaS Product Designer Vancouver', 'AI Interface Design Expert', 'Healthcare UX Designer', 'Product Designer', 'Design Systems'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'Kevin Arthur | Design Engineer & AI Interface Design Expert',
    description: 'Vancouver-based Design Engineer creating AI-powered healthcare interfaces. 97% diagnostic accuracy. 500+ facilities served.',
    url: '/',
    siteName: 'Kevin Arthur Design Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Kevin Arthur | Design Engineer & AI Interface Expert',
    card: 'summary_large_image',
    description: 'Design Engineer specializing in AI interface design | Healthcare UX | Vancouver',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Google Fonts preconnect handled automatically by next/font */}
        {/* Note: Analytics preconnect hints removed - Partytown loads scripts in a web worker,
            so preconnect from main thread is unused and causes console warnings */}

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Plausible script moved to body with lazyOnload strategy for better performance */}
        {/* Partytown setup for offloading third-party scripts to web worker */}
        <PartytownSetup />
      </head>
      <body className={`${jost.variable} ${firaCode.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        {/* Analytics scripts - using native script tags (not Next.js Script) to prevent 
            auto-preload injection. Partytown handles these in a web worker. */}
        {process.env.NODE_ENV === 'production' && (
          <script
            src="https://plausible.io/js/script.js"
            data-domain="kevinarthur.design"
            data-api="https://plausible.io/api/event"
            type="text/partytown"
            defer
          />
        )}
        {/* Google tag (gtag.js) - Native script for Partytown web worker */}
        <script
          src="https://www.googletagmanager.com/gtag/js?id=G-L805WXGTZS"
          type="text/partytown"
          defer
        />
        <script
          id="google-analytics"
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-L805WXGTZS');
            `,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CursorProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main id="main-content" className="flex-grow">
                {children}
              </main>
              <Footer />
              <StickyCTA />
              {process.env.NODE_ENV === 'production' && <WebVitals />}
            </div>
          </CursorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}