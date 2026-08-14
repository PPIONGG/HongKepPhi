import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ฟอนต์ที่ใช้วาดการ์ดแชร์ ต้องติดไปกับ deployment ด้วย
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/**"],
    "/stories/[slug]/opengraph-image": ["./assets/**"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
