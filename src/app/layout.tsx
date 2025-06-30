import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/AuthContext";


export const metadata: Metadata = {
  metadataBase: new URL("https://www.sacviet.info.vn"),
  title: {
    default: "Sắc Việt - Kết nối tinh hoa thủ công Việt",
    template: "%s | Sắc Việt",
  },
  description:
    "Sắc Việt kết nối nghệ nhân thủ công Việt, tôn vinh văn hoá, lan toả giá trị Việt ra thế giới.",
  applicationName: "Sắc Việt",
  generator: "Next.js 14",
  keywords: [
    "Sắc Việt",
    "handicraft",
    "thủ công mỹ nghệ",
    "artisan",
    "handmade",
    "văn hoá Việt",
    "craft marketplace",
    "Vietnam crafts",
  ],
  authors: [{ name: "Sắc Việt Team", url: "https://www.sacviet.info.vn" }],
  creator: "Sắc Việt",
  publisher: "Sắc Việt",
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "vi-VN": "/vi",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "Sắc Việt - Kết nối tinh hoa thủ công Việt",
    description:
      "Sắc Việt kết nối nghệ nhân thủ công Việt, tôn vinh văn hoá, lan toả giá trị Việt ra thế giới.",
    url: "https://www.sacviet.info.vn/",
    siteName: "Sắc Việt",
    images: [
      {
        url: "/logo_.png",
        width: 1200,
        height: 630,
        alt: "Sắc Việt logo",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sacviet",
    creator: "@sacviet",
    title: "Sắc Việt - Kết nối tinh hoa thủ công Việt",
    description:
      "Sắc Việt kết nối nghệ nhân thủ công Việt, tôn vinh văn hoá, lan toả giá trị Việt ra thế giới.",
    images: [
      {
        url: "/logo_.png",
        alt: "Sắc Việt logo",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#ffffff",
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head />
      <body>
        <AuthProvider>
          <main className="w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
