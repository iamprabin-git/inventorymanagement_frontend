import type { NextConfig } from "next";

/** Laravel dev server — avoids CORS (localhost:3000 vs 127.0.0.1:8000 are different origins). */
const backendProxyTarget =
  process.env.BACKEND_PROXY_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api-backend/:path*",
        destination: `${backendProxyTarget.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
