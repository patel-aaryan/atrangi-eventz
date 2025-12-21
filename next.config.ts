import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-469df5b331c2482787a10c805b725b2f.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
