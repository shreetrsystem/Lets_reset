import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Required for static export in some CDNs if not using image optimization API
  },
};

export default nextConfig;
