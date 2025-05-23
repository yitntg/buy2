/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'pzjhupjfojvlbthnsgqt.supabase.co',
      'images.unsplash.com',
      'picsum.photos',
      'placehold.co'
    ],
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig 