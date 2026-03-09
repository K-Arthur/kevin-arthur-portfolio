const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Target modern browsers to reduce polyfill size
  compiler: {
    // Remove unnecessary runtime checks for modern browsers
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable production source maps for debugging and Lighthouse insights
  productionBrowserSourceMaps: true,
  // output: 'export' removed to enable Vercel edge/serverless capabilities

  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    // Using unoptimized because Cloudinary already handles image sizing, formatting, and quality (f_auto,q_auto)
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

  // Headers restored for robust caching and security at the Edge
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.googletagmanager.com https://plausible.io https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://www.google-analytics.com https://www.googletagmanager.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://plausible.io https://vercel.live https://vitals.vercel-insights.com",
              "frame-src 'self' https://calendly.com https://vercel.live",
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
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Add webpack configuration for video handling, Windows compatibility, and bundle optimization
  webpack: (config, { isServer, dev }) => {
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


    // Production optimizations for smaller bundles
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            // Separate three.js into its own chunk
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three|three-mesh-bvh)[\\/]/,
              name: 'three-bundle',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Separate framer-motion
            framer: {
              test: /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
              name: 'framer-motion-bundle',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Separate icons
            icons: {
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              name: 'icons-bundle',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate UI components (Radix, etc.)
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: 'ui-bundle',
              priority: 15,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // Turbopack configuration (Next.js 16 default bundler)
  // Webpack optimizations apply only to production builds
  turbopack: {},

  // Add experimental features for better video handling and bundle optimization
  experimental: {
    // Enable CSS optimization with critters in production - inlines critical CSS to reduce render-blocking
    optimizeCss: process.env.NODE_ENV === 'production',
    // Optimize package imports to reduce bundle duplication
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'react-icons/fa',
      'react-icons/si',
      'react-icons/bs',
      'react-icons/fi',
      'react-icons/hi',
      '@react-three/fiber',
      '@react-three/drei',
      'recharts',
      'clsx',
      'tailwind-merge'
    ],
    // Disable legacy polyfills for modern browsers - saves ~8KB
    // Browserslist in package.json defines supported browsers
    disableOptimizedLoading: false,
  },

  // Redirects restored for serverless mode
  redirects: async () => {
    return [
      {
        source: '/images/work/:path*.mov',
        destination: '/images/work/:path*.mp4',
        permanent: false,
      },
    ];
  },
};

module.exports = withMDX(nextConfig);