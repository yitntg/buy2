/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.pixabay.com', 'images.unsplash.com', 'placeholder.pics']
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig 