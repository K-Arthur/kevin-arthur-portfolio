import './globals.css';
import { Jost, Fira_Code } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { CursorProvider } from '@/components/CursorProvider';
import WebVitalsWrapper from '@/components/WebVitalsWrapper';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { personSchema, websiteSchema } from '@/lib/structured-data';
import { getSiteUrl } from '@/lib/site-url';

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

const siteUrl = getSiteUrl();

export const metadata = {
  title: {
    default: 'Kevin Arthur | Design Engineer & Product Designer',
    template: '%s | Kevin Arthur Design'
  },
  description: 'I design product interfaces and ship them in code. Design Engineer and Product Designer in Vancouver, open to remote roles in Canada. Founder of Varve (v0.5.0). React, TypeScript, Next.js.',
  keywords: ['Design Engineer', 'Product Designer', 'Frontend Engineer', 'React', 'TypeScript', 'Next.js', 'Vancouver', 'Canada remote', 'Varve'],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'Kevin Arthur | Design Engineer & Product Designer',
    description: 'I design product interfaces and ship them in code. Design Engineer and Product Designer in Vancouver, open to remote roles in Canada.',
    url: '/',
    siteName: 'Kevin Arthur Design',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Kevin Arthur — Design Engineer and Product Designer. I design product interfaces and ship them in code.',
      },
    ],
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
    title: 'Kevin Arthur | Design Engineer & Product Designer',
    card: 'summary_large_image',
    description: 'I design product interfaces and ship them in code. Vancouver, open to remote roles in Canada.',
    images: ['/images/og-default.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme color for address bar - matches manifest */}
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />

        {/* Apple mobile web app config */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kevin Arthur" />

        {/* Preconnect to external resources used above-the-fold */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Icons - loaded with standard priority */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />

        {/* Web Manifest - standard loading (doesn't block rendering) */}
        <link rel="manifest" href="/site.webmanifest" crossOrigin="use-credentials" />

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
      <body suppressHydrationWarning className={`${jost.variable} ${firaCode.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
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
              gtag('config', 'G-L805WXGTZS', {
                cookie_flags: 'SameSite=None;Secure',
                cookie_domain: 'auto',
                cookie_expires: 63072000,
                cookie_update: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
                restricted_data_processing: true,
                send_page_view: true,
                transport_type: 'beacon'
              });
            `,
          }}
        />

        {/* Unregister the old home-page cache SW so returning visitors drop it */}
        <Script
          id="service-worker-unregister"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function (registrations) {
                  registrations.forEach(function (registration) {
                    registration.unregister();
                  });
                });
              }
              if (window.caches) {
                caches.keys().then(function (keys) {
                  keys.forEach(function (key) {
                    caches.delete(key);
                  });
                });
              }
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
              {process.env.NODE_ENV === 'production' && <WebVitalsWrapper />}
            </div>
          </CursorProvider>
        </ThemeProvider>
        {/* Vercel Analytics & Speed Insights - production only */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
