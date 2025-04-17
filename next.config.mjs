/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['seng513memory.blob.core.windows.net'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;