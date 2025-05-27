import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/AuthContext";

export const metadata: Metadata = {
  title: "Sắc Việt",
  description: "Kết nối tinh hoa thủ công Việt. Tôn vinh bản sắc, lan tỏa giá trị ",
   icons: {
    icon: "/logo_.png",
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
