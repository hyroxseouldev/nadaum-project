import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "나다움 프로젝트",
  description: "나다움, 우리안의 이야기",
  openGraph: {
    title: "나다움 프로젝트",
    description: "나다움, 우리안의 이야기",
    images: [
      {
        url: "/logo/logo.png", // public 폴더에 있는 이미지
        width: 1200,
        height: 630,
        alt: "나다움 프로젝트 미리보기",
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "나다움 프로젝트",
    description: "나다움, 우리안의 이야기",
    images: ["/logo/logo.png"],
  },
};
export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSans.variable} ${notoSansMono.variable} antialiased`}
      >
        {children}
        {modal}
        <Toaster />
      </body>
    </html>
  );
}
