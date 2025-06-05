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
      <div className="h-screen flex flex-col justify-between">
      <div className="bg-white">
        <div className="py-4 flex items-center justify-between 2xl:mx-52 xl:mx-40 lg:mx-32 sm:mx-20  text-[#8B5A2B] ">
          <div className="flex  items-center cursor-pointer" onClick={() => route.push('/')} title="Về trang chủ">
            <Image src={'/logo_.png'} width={60} height={60} alt="logo" />
            <span className="font-bold text-3xl">SẮC VIỆT</span>
          </div>
          <div>
            <p onClick={() => route.push("/contant")}>Bạn cần hỗ trợ gì ?</p>
          </div>
        </div>
      </div>
     <div className="py-10 bg-[#EAE0C8] h-full"> {children}</div>
      <div><Footer /></div> 
      </div>
  );
}
