/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only ignore during development, enable for production builds
    ignoreDuringBuilds: process.env.NODE_ENV === "development",
  },
  typescript: {
    // Only ignore during development, enable for production builds
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
