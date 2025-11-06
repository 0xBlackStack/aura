import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "../env": path.resolve(__dirname, "env.ts"),
    };
    return config;
  },
};

export default nextConfig;
