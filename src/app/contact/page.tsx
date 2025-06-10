"use client"
import { BiSolidPhoneCall } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FormContact } from "./components/FormContact";
import { BreadCrumb } from "./components/BreadCrumb";


export default function Contact() {
  return ( 
    <div className="pt-20 flex flex-col justify-center max-sm:m-2 max-lg:m-10 max-lg:pt-0 max-xl:m-20 max-[1540px]:mx-36 max-[1540px]:mt-10 mx-96">
      <div className="my-4">
       <BreadCrumb />
      </div>
      <div className="grid grid-cols-12 ">
        <div className="col-span-4 bg-white  mr-4 rounded-sm shadow-2xl p-10 max-sm:hidden max-lg:hidden max-xl:hidden max-[1540px]:my-10">
          <div className="text-xs">
            <div className="flex items-center">
              <BiSolidPhoneCall className="text-xl text-[#C95050] " />
              <p className="font-medium text-2xl xl:text-[18px] ml-2">Liên hệ với chúng tôi</p>
            </div>
            <p className="my-4">Chúng tôi luôn sẵn sàng 24/7</p>
            <p>Hotline: 0379.636.362</p>
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
        <div className="max-sm:col-span-12 max-lg:col-span-12 max-xl:col-span-12 col-span-8 px-10 bg-white rounded-sm shadow-2xl max-[1540px]:my-10">
          <FormContact />
        </div>
      </div>
    </div>
  );
}
