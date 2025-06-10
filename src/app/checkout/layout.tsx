"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const roter = useRouter();
  return (
    <div className="flex flex-col min-h-screen text-[var(--color-text-root)] bg-white">
      <div className="">
        <div className="py-4  text-[#8B5A2B] max-xl:mx-0 max-2xl:mx-36 mx-96">
          <span onClick={() => roter.push("/")} className="max-sm:block hidden absolute ml-2 mt-1"><IoArrowBackOutline className="top-0 left-0 traslate-y-1/2" /></span>
          <div className="flex items-center justify-center">
          <p className="font-medium max-sm:text-sm max-sm:block hidden">Thanh toán</p>
          </div>
          <div
            className="flex items-center cursor-pointer max-sm:hidden"
            onClick={() => roter.push("/")}
            title="Về trang chủ"
          >
            <Image src={"/logo_.png"} width={60} height={60} alt="logo" />
            <span className="font-bold text-3xl xl:text-xl max-sm:text-xl">
              SẮC VIỆT <span className="font-medium text-xl xl:text-sm max-sm:text-xs">| Thanh toán</span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex bg-[var(--color-bg-body)]">
        {children}
      </div>
    </div>
  );
}
