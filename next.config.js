const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable source maps in production for debugging and Lighthouse insights
  productionBrowserSourceMaps: true,

  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Add video optimization and protection
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          // HSTS - Force HTTPS for 2 years with subdomains and preload
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Content Security Policy - Protect against XSS attacks
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://plausible.io https://assets.calendly.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://www.googletagmanager.com https://raw.githack.com https://raw.githubusercontent.com https://assets.calendly.com",
              "font-src 'self' https://fonts.gstatic.com https://assets.calendly.com",
              "connect-src 'self' https://www.google-analytics.com https://plausible.io https://res.cloudinary.com https://vitals.vercel-insights.com https://raw.githack.com https://raw.githubusercontent.com https://calendly.com https://api.calendly.com",
              "media-src 'self' https://res.cloudinary.com blob:",
              "frame-src 'self' https://calendly.com https://assets.calendly.com",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Cross-Origin-Opener-Policy - Isolate browsing context
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          // Cross-Origin-Embedder-Policy - Control cross-origin resources
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          // X-Frame-Options - Prevent clickjacking (legacy, CSP frame-ancestors is preferred)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // X-Content-Type-Options - Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer-Policy - Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions-Policy - Restrict browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        source: '/images/work/:path*.(mp4|mov|webm|ogg|avi)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Add webpack configuration for video handling and Windows compatibility
  webpack: (config, { isServer }) => {
    // Force single version of framer-motion and react-icons
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      'framer-motion': path.resolve(__dirname, 'node_modules/framer-motion'),
      'react-icons': path.resolve(__dirname, 'node_modules/react-icons'),
    };

    // Windows-specific optimizations to prevent file locking
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
    };

    // Disable webpack's persistent cache on Windows to prevent file locking
    if (process.platform === 'win32') {
      config.cache = false;
    }

    // Add video file extensions to asset handling
    config.module.rules.push({
      test: /\.(mp4|mov|webm|ogg|avi)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/media/',
          outputPath: 'static/media/',
          name: '[name].[hash].[ext]',
        },
      },
    });

    return config;
  },

  // Add experimental features for better video handling and bundle optimization
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-icons', '@react-three/fiber', '@react-three/drei', 'date-fns', 'lodash', 'three'],
  },

  // Add redirects for video format fallbacks
  redirects: async () => {
    return [
      // Redirect .mov files to .mp4 alternatives if they exist
      {
        source: '/images/work/:path*.mov',
        destination: '/images/work/:path*.mp4',
        permanent: false,
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: '(?i).*(chrome|firefox|edge).*',
          },
        ],
      },
    ];
  },
};

module.exports = withMDX(nextConfig);