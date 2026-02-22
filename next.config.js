const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable source maps in production for debugging and Lighthouse insights
  productionBrowserSourceMaps: true,
  output: 'export',

  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // NOTE: Headers are disabled for static export.
  // For static export (output: 'export'), configure headers at your CDN or web server level.
  // To re-enable headers for server mode, uncomment the following:
  /*
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.googletagmanager.com https://plausible.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://res.cloudinary.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://plausible.io",
              "frame-src 'self' https://calendly.com",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  */

  // Add webpack configuration for video handling and Windows compatibility
  webpack: (config, { isServer }) => {
    // Resolve Framer Motion issues occurring during static export - removed aliases as they might cause initialization errors
    const path = require('path');

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
    // CSS optimization is disabled for faster loading (includes inlining critical CSS)
    optimizeCss: false,
    // optimizePackageImports: ['lucide-react', 'framer-motion', 'react-icons', '@react-three/fiber', '@react-three/drei', 'date-fns', 'lodash', 'three'],
  },

  // NOTE: Redirects are disabled for static export.
  // For static export, handle redirects at your CDN or web server level.
  /*
  redirects: async () => {
    return [
      {
        source: '/images/work/:path*.mov',
        destination: '/images/work/:path*.mp4',
        permanent: false,
      },
    ];
  },
  */
};

module.exports = withMDX(nextConfig);