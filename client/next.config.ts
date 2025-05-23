import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ahmedfahim.vercel.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "strapi-dev.scand.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
