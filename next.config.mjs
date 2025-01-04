/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "files.edgestore.dev",
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "zeris.vercel.app",
      },
      {
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
