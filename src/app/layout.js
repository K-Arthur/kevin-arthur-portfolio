import './globals.css';
import { Jost, Fira_Code } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  title: 'Kevin Arthur - Product & UI/UX Designer',
  description: 'Crafting intuitive digital experiences for AI, fintech, and social media.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Kevin Arthur - Product & UI/UX Designer',
    description: 'Crafting intuitive digital experiences for AI, fintech, and social media.',
    url: '/',
    siteName: 'Kevin Arthur',
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
    title: 'Kevin Arthur',
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {process.env.NODE_ENV === 'production' && (
          <script 
            defer 
            data-domain="kevinarthur.design" 
            src="https://plausible.io/js/script.js"
            data-api="https://plausible.io/api/event"
          ></script>
        )}
      </head>
      <body className={`${jost.variable} ${firaCode.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}