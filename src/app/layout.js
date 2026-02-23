import './globals.css';
import { Jost, Fira_Code } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { CursorProvider } from '@/components/CursorProvider';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { personSchema, websiteSchema } from '@/lib/structured-data';

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
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Preload LCP image for faster rendering */}
        <link 
          rel="preload" 
          as="image" 
          href="https://res.cloudinary.com/dov1tv077/image/upload/f_auto,q_auto:good,w_1200/v1752155990/Welcome_screen_uwdoot.png"
          type="image/webp"
          fetchPriority="high"
        />
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

      </head>
      <body className={`${jost.variable} ${firaCode.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        {/* Analytics scripts - using Next.js Script with lazyOnload strategy
            This loads scripts after all other resources, improving page load performance */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="https://plausible.io/js/script.js"
            data-domain="kevinarthur.design"
            data-api="https://plausible.io/api/event"
            strategy="lazyOnload"
          />
        )}
        {/* Google Analytics - lazyOnload strategy for minimal performance impact */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L805WXGTZS"
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
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