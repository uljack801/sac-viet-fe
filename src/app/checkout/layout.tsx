"use client";
import { Footer } from "@/app/components/layout/footer/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { InfoUser } from "../components/layout/header/InfoUser";
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const roter = useRouter();
  return (
    <div className="flex flex-col min-h-screen text-[var(--color-text-root)] bg-white">
      <div className="2xl:mx-52 xl:mx-40 lg:mx-32 sm:mx-20">
        <div className="py-4 flex items-center justify-between text-[#8B5A2B] ">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => roter.push("/")}
            title="Về trang chủ"
          >
            <Image src={"/logo_.png"} width={60} height={60} alt="logo" />
            <span className="font-bold text-3xl xl:text-xl">
              SẮC VIỆT <span className="font-medium text-xl xl:text-sm">| Thanh toán</span>
            </span>
          </div>
          <InfoUser />
        </div>
      </div>
      <div className="flex-1 flex items-center bg-[var(--color-bg-body)]">
        {children}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
