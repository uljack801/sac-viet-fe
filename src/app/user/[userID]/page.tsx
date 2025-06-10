'use client'

import NotFound from "@/app/not-found";
import { useParams, useRouter } from "next/navigation";
import { InputFormInfoUser } from "./components/FormInfoUser";
import { cn } from "@/lib/utils";
import { InputFormChangePass } from "./components/FormChangePass";
import { ListAddress } from "./components/ListAddress";

export default function Index() {
  const params = useParams()
  const route = useRouter();
  return (
    <div className="pt-20 max-xl:mx-0 max-[1540px]:mx-36 max-[1540px]:my-10 mx-96 my-10" >
      <div className="grid grid-cols-12 text-sm pt-4">
        <div className="col-span-4 flex justify-center bg-white rounded-sm mr-5 max-sm:hidden max-lg:hidden max-xl:hidden border">
          <div className="">
            <p className="font-medium text-[18px] pr-5 mt-10">Quản Lý Tài Khoản</p>
            <div className="ml-10 mt-2 space-y-3 text-sm font-light cursor-pointer">
              <p className={cn((params.userID === "profile") && "font-medium")} onClick={() => route.push('/user/profile')}>Thông tin cá nhân</p>
              <p className={cn((params.userID === "address") && "font-medium")} onClick={() => route.push('/user/address')}>Địa chỉ nhận hàng</p>
              <p className={cn((params.userID === "change-password") && "font-medium")} onClick={() => route.push('/user/change-password')}>Thay đổi mật khẩu</p>
            </div>
          </div>
        </div>
        <div className="hidden max-sm:block max-lg:block max-xl:block col-span-12">
          <div className=" grid grid-cols-3 p-2 font-medium gap-2 max-lg:px-10 max-xl:px-20">
          <p className={cn((params.userID === "profile") ? "bg-neutral-200 text-neutral-400" : "bg-white" , " rounded-sm text-center shadow max-sm:p-1 max-lg:p-4 max-xl:p-6")} onClick={() => route.push('/user/profile')}>Thông tin cá nhân</p>
          <p className={cn((params.userID === "address") ? "bg-neutral-200 text-neutral-400" : "bg-white" , " rounded-sm text-center shadow max-sm:p-1 max-lg:p-4 max-xl:p-6")} onClick={() => route.push('/user/address')}>Địa chỉ nhận hàng</p>
          <p className={cn((params.userID === "change-password") ? "bg-neutral-200 text-neutral-400" : "bg-white" , " rounded-sm text-center shadow max-sm:p-1 max-lg:p-4 max-xl:p-6")} onClick={() => route.push('/user/change-password')}>Thay đổi mật khẩu</p>
          </div>
        </div>
        <div className="col-span-8 rounded-sm bg-white max-sm:col-span-12 max-sm:m-2 shadow max-lg:col-span-12  max-lg:m-10 max-xl:col-span-12  max-xl:m-20">
          {(() => {
            if (params.userID === "profile") {
              return <InputFormInfoUser />
            } else if (params.userID === 'address') {
              return <ListAddress />
            } else if (params.userID === 'change-password') {
              return <InputFormChangePass />
            } else {
              return NotFound()
            }
          })()}
        </div>
      </div>
    </div>
  )

}
