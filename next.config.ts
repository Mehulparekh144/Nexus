import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb', // For image uploads
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '6yaatgf5ei7qq36s.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
