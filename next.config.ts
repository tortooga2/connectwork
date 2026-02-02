import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to succeed even if
    // there are ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
