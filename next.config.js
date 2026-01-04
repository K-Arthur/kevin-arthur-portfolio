const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // Add experimental features for better video handling
  experimental: {
    optimizePackageImports: ['lucide-react'],
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