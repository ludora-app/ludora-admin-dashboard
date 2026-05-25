import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react", "js-cookie", "ky", "@tanstack/react-query"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-6a476594ef1f4a5987167004d5d7774f.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:2424/:path*",
      },
    ];
  },
};

export default nextConfig;
