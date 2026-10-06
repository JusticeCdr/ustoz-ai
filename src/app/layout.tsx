import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ustoz AI — Zamonaviy Kasblar Tanlovi | 2026 (Futuristic 3D Platform)",
  description:
    "Sun'iy intellekt, robototexnika, kiberxavfsizlik va zamonaviy texnologiyalar bo'yicha Ustoz AI tomonidan tashkil etilgan eng nufuzli tanlov. Ro'yxatdan o'ting va sovrinlarni yutib oling!",
  keywords: [
    "Ustoz AI",
    "Zamonaviy Kasblar",
    "Sun'iy Intellekt",
    "Prompt Engineering",
    "Fullstack",
    "Kiberxavfsizlik",
    "Data Science",
    "Tanlov 2026",
    "Telegram Bot",
  ],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark scroll-smooth">
      <body className="bg-[#050713] text-[#f0f4fc] antialiased min-h-screen cyber-bg-grid relative selection:bg-cyan-500 selection:text-black">
        <div className="scanline" />
        {children}
      </body>
    </html>
  );
}
