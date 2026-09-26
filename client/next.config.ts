import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lets `next dev` serve the app to other devices on the LAN (e.g. http://192.168.56.1:3000)
  allowedDevOrigins: ["192.168.56.1", "192.168.*.*"],
  // property photos stored on the API server (no S3 configured) are served at /uploads
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
