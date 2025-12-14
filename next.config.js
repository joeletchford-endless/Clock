/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Update this to match your GitHub repo name
  basePath: process.env.NODE_ENV === 'production' ? '/Clock' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Clock/' : '',
}

module.exports = nextConfig

