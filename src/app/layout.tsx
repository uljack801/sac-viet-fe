import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/AuthContext";

export const metadata: Metadata = {
  title: "Sắc Việt - Kết nối tinh hoa thủ công Việt",
  description: "Sắc Việt kết nối nghệ nhân thủ công Việt, tôn vinh văn hoá, lan toả giá trị Việt ra thế giới.",
  metadataBase: new URL("https://www.sacviet.info.vn"),
  robots: "index, follow",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sắc Việt - Kết nối tinh hoa thủ công Việt",
    description: "Sắc Việt kết nối nghệ nhân thủ công Việt, tôn vinh văn hoá, lan toả giá trị Việt ra thế giới.",
    url: "https://www.sacviet.info.vn/",
    siteName: "Sắc Việt",
    images: [
      {
        url: "/logo_.png", 
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >  
       <body>
        <AuthProvider>
          <main className="w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
