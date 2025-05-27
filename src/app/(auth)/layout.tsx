"use client"
import { Footer } from "@/app/components/layout/footer/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route = useRouter();
  return (
    <div className="items-start h-screen">
      <div className="">
      <div className="bg-white">
        <div className="py-4 flex items-center justify-between lg:mx-24  xl:mx-48 2xl:mx-80  text-[#8B5A2B] ">
          <div className="flex  items-center cursor-pointer" onClick={() => route.push('/')} title="Về trang chủ">
            <Image src={'/logo_.png'} width={60} height={60} alt="logo" />
            <span className="font-bold text-3xl">SẮC VIỆT</span>
          </div>
          <div>
            <p onClick={() => route.push("/contant")}>Bạn cần hỗ trợ gì ?</p>
          </div>
        </div>
      </div>
     <div className="py-10 bg-[#EAE0C8] "> {children}</div>
      <div><Footer /></div> 
      </div>
    </div>
  );
}
