import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "puyvcsdfqhuindqkuhyr.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      // 다른 Supabase 프로젝트나 이미지 도메인이 있다면 추가
      // {
      //   protocol: 'https',
      //   hostname: 'other-project.supabase.co',
      //   port: '',
      //   pathname: '/storage/v1/object/public/**',
      // }
    ],
    // 또는 더 간단하게 도메인만 허용하려면:
    // domains: ["puyvcsdfqhuindqkuhyr.supabase.co"],
    // // 이미지 최적화 옵션 (선택사항)
    // formats: ["image/webp", "image/avif"],
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // // 이미지 로더 설정 (기본값 사용)
    // loader: "default",
    // 위험한 설정 (프로덕션에서는 사용하지 말 것)
    // unoptimized: true,
  },
};

export default nextConfig;
