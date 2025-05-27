"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function SellerRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const roter = useRouter();
  return (
    <div className="items-start h-screen">
      <div className="bg-white">
        <div className="py-4 grid grid-cols-4 items-center   text-[#8B5A2B] ">
          <div className="col-span-1 flex items-center cursor-pointer" onClick={() => roter.push('/')} title="Về trang chủ">
            <Image src={'/logo_.png'} width={60} height={60} alt="logo" />
            <span className="font-bold text-3xl flex w-full">SẮC VIỆT</span>
          </div>
          <div className="ml-4 text-xl col-span-2 flex items-center justify-center">
            <p>Đăng ký trở thành Người bán Sắc Việt</p>
          </div>
          <div className="col-span-1 flex justify-end">
            <Button className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]" onClick={() => roter.push('/')} title="Về trang chủ">Quay lại trang mua sắm!</Button>
          </div>
        </div>
      </div>
     <div className="h-full bg-[#EAE0C8]"> {children}</div>
    </div>
  );
}
