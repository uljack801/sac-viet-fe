"use client"
import { Button } from "@/components/ui/button"
import { InputSearch } from "./InputSearch"
import { PiShoppingCartThin } from "react-icons/pi"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/AuthContext";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HiOutlineMenu } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const SidebarHeader = () => {
  const [valueSearch, setValueSearch] = useState('')
  const route = useRouter();
  const { cart, listCategory } = useAuth();
  useEffect(() => {
  }, [cart])

  return (
    <div className=" bg-white">
      <div className="flex py-2 items-center justify-between text-[#8B5A2B]  max-lg:mx-1 max-xl:mx-6 max-2xl:mx-36 mx-96">
        <div className="flex items-center cursor-pointer max-sm:hidden" onClick={() => route.push('/')}>
          <Image src="/logo_.png" alt="logo1" width={60} height={60} />
          <span className="max-lg:text-xl font-bold ">SẮC VIỆT</span>
        </div>
        <div className="flex justify-center items-center max-sm:hidden">
          <Button onClick={() => route.replace('/')} className={cn("bg-inherit hover:bg-inherit shadow-none text-[var(--color-text-root)]")}>Trang chủ</Button>
          <Button onClick={() => route.replace('/conversation')} className="bg-inherit hover:bg-inherit shadow-none  text-[var(--color-text-root)]">
            Tin tức
          </Button>
          <Button onClick={() => route.replace('/contact')} className="bg-inherit hover:bg-inherit shadow-none text-[var(--color-text-root)] ">
            Liên hệ
          </Button>
          <Button onClick={() => route.replace('/about')} className="bg-inherit hover:bg-inherit shadow-none text-[var(--color-text-root)] ">Về chúng tôi</Button>
        </div>
        <div className="flex justify-center items-center relative xl:w-80 max-sm:hidden max-lg:hidden max-xl:hidden">
          <InputSearch />
          <div className="group">
            <div className="relative">
              <PiShoppingCartThin className="text-2xl mx-2" title="giỏ hàng" />
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

        <Sheet>
          <SheetTrigger className="h-full items-center max-sm:block hidden py-4">
            <div className="relative mx-1">
              <HiOutlineMenu className="text-2xl mx-2" title="menu" />
            </div>
          </SheetTrigger>
          <SheetContent className="my-24 text-[#8B5A2B] w-3/5" side="left">
            <SheetHeader className="h-full">
              <SheetTitle className="text-[#8B5A2B]"></SheetTitle>
              <div className="flex flex-col justify-center items-center">
                <Button onClick={() => route.replace('/')} className={cn("bg-inherit hover:bg-inherit shadow-none text-[var(--color-text-root)]")}>Trang chủ</Button>
                <Button onClick={() => route.replace('/conversation')} className="bg-inherit hover:bg-inherit shadow-none  text-[var(--color-text-root)]">
                  Tin tức
                </Button>
                <Button onClick={() => route.replace('/contact')} className="bg-inherit hover:bg-inherit shadow-none text-[var(--color-text-root)] ">
                  Liên hệ
                </Button>
                <Button onClick={() => route.replace('/about')} className="bg-inherit hover:bg-inherit shadow-none text-[var(--color-text-root)] ">Về chúng tôi</Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="font-medium text-sm">Danh mục sản phẩm</DropdownMenuTrigger>
                <DropdownMenuContent className="ml-16">
                  {listCategory?.data.map(category => (
                    <DropdownMenuItem key={category._id} className="text-[#8B5A2B]" onClick={() => route.push(`/${category.slug}`)}>{category.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <div className="max-sm:block max-sm:w-full 
        
        max-lg:block max-xl:block hidden  ">
          <div className="flex items-center">
          <div className="max-sm:w-full relative max-lg:flex max-lg:justify-end">
            <Input placeholder="Tìm kiếm sản phẩm ?" value={valueSearch}
              onChange={(e) => {
                setValueSearch(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  route.push(`/search?search=${encodeURIComponent(valueSearch)}`);
                  setValueSearch('');
                }
              }}
              className="mt-0 py-0 h-8 text-xs max-lg:w-52 max-sm:w-full max-xl:w-80"
              min={1} />
            <IoSearch className="text-xl absolute top-1/2 right-1 -translate-y-1/2" onClick={() => {
              route.push(`/search?search=${encodeURIComponent(valueSearch)}`)
              setValueSearch('')
            }} />
          </div>
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger className="h-full items-center">
                <div className="relative">
                  <PiShoppingCartThin className="text-2xl mx-2" title="giỏ hàng" />
                  <p className="absolute -top-2 text-xs right-0 bg-red-500 text-white rounded-2xl px-1" hidden={cart?.length === 0 || cart?.length === undefined}>{cart?.length}</p>
                </div>
              </SheetTrigger>
              <SheetContent className="mt-24 text-[#8B5A2B]" >
                <SheetHeader className="h-full">
                  <SheetTitle className="text-[#8B5A2B]">Danh sách giỏ hàng</SheetTitle>
                  {(cart?.length === 0 || cart?.length === undefined) && (
                    <div className="w-full h-full flex flex-col justify-center items-center ">
                      <PiShoppingCartThin className="text-4xl text-neutral-400" />
                      <p className="text-neutral-400">Chưa có sản phẩm</p>
                    </div>
                  )}
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
                        <div className="flex flex-col justify-between">
                          <p className="text-sm line-clamp-1 text">{value.name}</p>
                          {value.discount_percentage > 0 && <p className="text-[10px]  line-through">  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value.price)}</p>}
                          {value.discount_percentage > 0 ? <p className="text-xs mt-1 text-red-500">{new Intl.NumberFormat("vi-Vn", { style: "currency", currency: "VND" }).format((value.price / 100) * (100 - value.discount_percentage))} <span className="text-[10px]">-{value.discount_percentage}%</span></p>
                            :
                            <p className="text-sm">  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value.price)}</p>
                          }

                        </div>
                      </div>
                    )
                  })}
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}