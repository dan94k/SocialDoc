import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: { browser: "" },
    },
  },
  webpack: (config) => {
    // Fallback for non-Turbopack builds
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
