/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['placeholder.com'], // Add your image domains here
  },
  webpack: (config) => {
    config.resolve.alias['@/lib'] = path.join(__dirname, 'lib');
    config.resolve.alias['@/components'] = path.join(__dirname, 'components');
    config.resolve.alias['@/hooks'] = path.join(__dirname, 'hooks');
    return config;
  },
}

module.exports = nextConfig
