/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'pzjhupjfojvlbthnsgqt.supabase.co'
    ],
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig 