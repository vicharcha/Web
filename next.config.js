/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['placeholder.com'], // Add your image domains here
  },
  eslint: {
    dirs: ['pages', 'components', 'lib', 'hooks', 'models', 'middleware'], // Run ESLint on these directories during build
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        dns: false,
        net: false,
        tls: false,
      };
    }
    
    config.resolve.alias['@/lib'] = path.join(__dirname, 'lib');
    config.resolve.alias['@/components'] = path.join(__dirname, 'components');
    config.resolve.alias['@/hooks'] = path.join(__dirname, 'hooks');
config.resolve.alias['@/models'] = path.join(__dirname, 'models');
config.resolve.alias['@/middleware'] = path.join(__dirname, 'middleware');
config.resolve.alias['@/app'] = path.join(__dirname, 'app');
    return config;
  },
}

module.exports = nextConfig
