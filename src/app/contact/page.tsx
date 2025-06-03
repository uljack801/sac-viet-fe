"use client"
import { BiSolidPhoneCall } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FormContact } from "./components/FormContact";
import { BreadCrumb } from "./components/BreadCrumb";


export default function Contact() {
  return ( 
    <div className="pt-20 flex flex-col justify-center 2xl:mx-80 xl:mx-40 lg:mx-32 sm:mx-20">
      <div className="mt-10">
       <BreadCrumb />
      </div>
      <div className="grid grid-cols-12 ">
        <div className="col-span-4 bg-white my-10 mr-4 rounded-sm shadow-2xl p-10">
          <div className="text-xs">
            <div className="flex items-center">
              <BiSolidPhoneCall className="text-xl text-[#C95050] " />
              <p className="font-medium text-2xl xl:text-[18px] ml-2">Liên hệ với chúng tôi</p>
            </div>
            <p className="my-4">Chúng tôi luôn sẵn sàng 24/7</p>
            <p>Hotline: 086.668.9999</p>
          </div>
          <div className="mt-10">
            <div className="text-xs">
              <div className="flex items-center">
                <MdEmail className="text-xl text-[#C95050] " />
                <p className="font-medium text-2xl xl:text-[18px] ml-2">
                  Gửi email cho chúng tôi
                </p>
              </div>
              <p className="my-4">
                Hãy điền vào mẫu của chúng tôi và chúng tôi sẽ liên hệ với bạn
                trong vòng 24 giờ
              </p>
              <p className="mb-2">Email: sacviet.support@gmail.com</p>
              <p>Email: sacviet.contact@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="col-span-8 px-10 bg-white my-10 rounded-sm shadow-2xl">
          <FormContact />
        </div>
      </div>
    </div>
  );
}
