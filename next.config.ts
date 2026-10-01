import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // URLs from the previous Squarespace site that people may still have.
  async redirects() {
    return [
      { source: "/home", destination: "/", statusCode: 301 },
      // the old "Pilot Program" nav folder pointed at its first page
      { source: "/pilot-program", destination: "/pilot", statusCode: 302 },
    ];
  },
};

export default nextConfig;
