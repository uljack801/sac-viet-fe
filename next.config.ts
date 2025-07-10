import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sacviet.nyc3.digitaloceanspaces.com',
        pathname: '/uploads/**',
      },
       {
        protocol: 'https',
        hostname: 'sacviet.nyc3.cdn.digitaloceanspaces.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
