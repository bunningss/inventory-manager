/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "springbird.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
