"use client";
import { useRouter } from "next/navigation";
import { SubscribeEmail } from "./SubscribeEmail";
import Image from "next/image";

export const Footer = () => {
  const route = useRouter()
  return (
    <div className="bg-white py-10 text-[#8B5A2B] max-sm:px-0 max-lg:px-4 max-xl:px-6 max-[1540px]:px-36 px-96 ">
      <div className="flex justify-between text-sm max-sm:flex-col items-center">
        <div className="flex flex-col justify-center items-center max-sm:hidden max-lg:hidden">
          <Image src="/logo_.png" alt="logo1" width={60} height={60} />
          <span className="text-2xl font-bold">SẮC VIỆT</span>
        </div>
        <div className="max-sm:hidden">
          <p className="text-xl font-semibold mb-4">Đăng ký</p>
          <SubscribeEmail />
        </div>
        <div className="max-sm:grid max-sm:grid-cols-3 max-sm:gap-1 max-sm:text-xs max-sm:m-2 max-lg:flex max-xl:flex flex">
          <div>
            <p className="max-sm:text-sm font-medium">Về chúng tôi</p>
            <p>Giới thiệu</p>
            <p>Liên hệ </p>
            <p>Tin tức đồ thủ công</p>
            <p>Câu hỏi thường gặp</p>
          </div>
          <div className="mx-2 cursor-pointer">
            <p className="max-sm:text-sm font-medium ">Tài khoản của bạn</p>
            <p onClick={() => route.push('/policy/privacy-policy')} >Chính sách bảo mật</p>
            <p>Điều khoản sử dụng</p>
            <p>Hướng dẫn và quy định</p>
          </div>
          <div>
            <p className="max-sm:text-sm font-medium ">Hỗ Trợ</p>
            <p>Hotline: 0379.636.362</p>
            <p>Hướng dẫn đặt hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};
