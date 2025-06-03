"use client"
import { Button } from "@/components/ui/button"
import { InputSearch } from "./InputSearch"
import { PiShoppingCartThin } from "react-icons/pi"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/AuthContext";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const SidebarHeader = () => {
  const route = useRouter();
  const { cart } = useAuth();  
  useEffect(() => {
  }, [cart ])

  return (
    <div className=" bg-white">
    <div className="flex py-2 items-center justify-between text-[#8B5A2B] 2xl:mx-80 xl:mx-40 lg:mx-32 sm:mx-20  ">
      <div className="flex items-center cursor-pointer" onClick={() => route.push('/')}>
        <Image src="/logo_.png" alt="logo1" width={60} height={60} />
        <span className="text-2xl xl:text-xl font-bold">SẮC VIỆT</span>
      </div>
      <div className="flex justify-center items-center">
        <Button onClick={() => route.replace('/')} className={cn("bg-inherit hover:bg-inherit shadow-none text-[var(--color-text-root)]" )}>Trang chủ</Button>
        <Button onClick={() => route.replace('/news')} className="bg-inherit hover:bg-inherit shadow-none  text-[var(--color-text-root)]">
          Tin tức
        </Button>
        <Button onClick={() => route.replace('/contact')} className="bg-inherit hover:bg-inherit shadow-none text-[var(--color-text-root)] ">
          Liên hệ
        </Button>
        <Button onClick={() => route.replace('/about')} className="bg-inherit hover:bg-inherit shadow-none text-[var(--color-text-root)] ">Về chúng tôi</Button>
      </div>
      <div className="flex justify-center items-center relative xl:w-80">
        <InputSearch />
        <div className="group">
          <div className="relative">
            <PiShoppingCartThin className="text-2xl ml-2" title="giỏ hàng" />
            <p className="absolute -top-2 text-xs -right-3 bg-red-500 text-white rounded-2xl px-1" hidden={cart?.length === 0 || cart?.length === undefined}>{cart?.length}</p>
          </div>
          <div className="absolute right-0 top-3 w-1/3 h-20 group-hover:block hidden"></div>
          <div className="bg-neutral-50 p-2 shadow-md border rounded-sm absolute w-full h-96 top-12 left-0 overflow-y-scroll z-10 group-hover:block hidden">
            {(cart?.length === 0 || cart?.length === undefined) && (
              <div className="w-full h-full flex flex-col justify-center items-center ">
                <PiShoppingCartThin className="text-4xl text-neutral-400" />
                <p className="text-neutral-400">Chưa có sản phẩm</p>
              </div>
            )}
            <div className="flex justify-between items-center">
              <p className="text-neutral-400 text-xs" hidden={cart?.length === 0 || cart?.length === undefined}>{cart?.length} sản phẩm thêm vào giỏ hàng</p>
              <Button className="text-white bg-red-500 hover:bg-red-500/75" hidden={cart?.length === 0 || cart?.length === undefined} onClick={() => route.push('/cart')}>Xem giỏ hàng</Button>
            </div>
            {cart && cart?.map((value, idx) => {              
              return (
                <div key={`product-in-cart-${value._id + idx}`} className="mt-2 flex cursor-pointer" onClick={() => route.push(`/product-details/${value._id}`)}>
                  <Image
                    src={`${value.img[0]}`}
                    alt="anh-san-pham"
                    width={60}
                    height={60}
                    className="mx-1 "
                  />
                  <div>
                    <p className="text-sm line-clamp-1">{value.name}</p>
                    <p className="text-[10px]  line-through">  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value.price)}</p>
                    <p className="text-xs mt-1 text-red-500">{new Intl.NumberFormat("vi-Vn", { style: "currency", currency: "VND" }).format((value.price / 100) * (100 - value.discount_percentage))} <span className="text-[10px]">-{value.discount_percentage}%</span></p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}