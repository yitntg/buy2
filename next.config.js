/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'picsum.photos',
      'placehold.co',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig 