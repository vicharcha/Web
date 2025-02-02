/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["placeholder.com"], // Add any other image domains you might use
  },
}

module.exports = nextConfig

