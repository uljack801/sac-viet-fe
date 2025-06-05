"use client";
import { SubscribeEmail } from "./SubscribeEmail";
import Image from "next/image";

export const Footer = () => {
  return (
    <div className="bg-white py-10 text-[#8B5A2B]">
      <div className="flex justify-between text-sm 2xl:mx-52 xl:mx-40 lg:mx-32 sm:mx-20 xl:text-xs">
        <div className="flex flex-col justify-center items-center">
          <Image src="/logo_.png" alt="logo1" width={60} height={60}/>
            <span className="text-2xl font-bold">SẮC VIỆT</span>
        </div>
        <div>
          <p className="text-xl xl:text-sm font-semibold mb-4">Đăng ký</p>
          <SubscribeEmail />
        </div>
        <div>
          <p className="text-xl xl:text-sm font-medium">Về chúng tôi</p>
          <p>Giới thiệu</p>
          <p>Liên hệ </p>
          <p>Tin tức đồ thủ công</p>
          <p>Câu hỏi thường gặp</p>
        </div>
        <div>
          <p className="text-xl xl:text-sm font-medium">Tài khoản của bạn</p>
          <p>Chính sách bảo mật</p>
          <p>Điều khoản sử dụng</p>
          <p>Hướng dẫn và quy định</p>
        </div>
        <div>
          <p className="text-xl xl:text-sm font-medium ">Hỗ Trợ khách hàng</p>
          <p>Hotline: 0379.636.362</p>
          <p>Hướng dẫn đặt hàng</p>
        </div>
      </div>
    </div>
  );
};
