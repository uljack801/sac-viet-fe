import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "@/app/AuthContext";

/**
 * RootLayout – enhanced with richer SEO metadata for Google and social platforms
 * – Includes keywords, authors, icons, manifest, Twitter Card, viewport, theme‑color, and JSON‑LD schema.
 */
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
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg" },
    ],
  },
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
        <Script
          id="ld-json-org"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Sắc Việt",
            url: "https://www.sacviet.info.vn",
            logo: "https://www.sacviet.info.vn/logo_.png",
            sameAs: [
              "https://www.facebook.com/sacviet",
              "https://www.instagram.com/sacviet",
            ],
          })}
        </Script>
        <AuthProvider>
          <main className="w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
