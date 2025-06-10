"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { PiUserListLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthContext";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export const InfoUser = () => {
  const { accessToken, setAccessToken, dataUser } = useAuth();
  const [checkLogin, setCheckLogin] = useState(false);
  const route = useRouter();


  useEffect(() => {
    if (dataUser && !checkLogin) {
      setCheckLogin(true);
    }
  }, [dataUser, checkLogin]);

  const handleLogout = async () => {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
    });
    if (res.status === 200) {
      setAccessToken(null);
      route.push('/')
      setTimeout(() => document.location.reload(), 1000)
    }
  };

  return (
    <div className="flex items-center justify-center">

      {!checkLogin ? (
        <span
          onClick={() => route.replace("/login")}
          className="flex justify-center items-center cursor-pointer py-1 px-1 rounded-sm  text-sm hover:bg-[#e4d5b2] "
          title="Nhấn để đăng nhập"
        >
          Đăng nhập <PiUserListLight className="p-0 text-2xl ml-1" />
        </span>
      ) : (
        <div>
          <div className="flex justify-center items-center cursor-pointer py-1 max-sm:hidden max-lg:hidden max-xl:hidden">
            <HoverCard>
              <HoverCardTrigger className="flex items-center justify-center " >
                <span className="text-sm font-medium mr-1">
                  {dataUser?.data.fullname || dataUser?.data.account}
                </span>
                <PiUserListLight className="text-2xl mr-1" />
              </HoverCardTrigger>
              <HoverCardContent className="mt-3 w-auto border mr-1 p-2 rounded-sm text-sm shadow-md bg-neutral-50 z-10 font-medium ">
                <Button onClick={() => route.push('/user/profile')} className="w-full bg-inherit shadow-none  hover:bg-[#dadadaab] text-[var(--color-text-root)]">Quản lý tài khoản</Button>
                <br />
                <Button onClick={() => route.push('/order?slug=1')} className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]" >Đơn mua</Button>
                <br />
                <Button onClick={() => route.push('/cart')} className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]" >Danh sách giỏ hàng</Button>
                <br />
                {dataUser?.data.role.includes("seller") && dataUser.data.isSellerApproved ?
                  (<Button className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]" onClick={() => route.push(`/seller`)}>Quản lý cửa hàng</Button>)
                  :
                  (<Button className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]" onClick={() => route.push('/seller-register')}>Đăng ký kênh bán hàng</Button>)
                }
                <br />
                <Button onClick={() => handleLogout()} className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]">
                  Đăng xuất
                </Button>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="max-sm:block max-lg:block max-xl:block hidden">
            <Sheet>
              <SheetTrigger className="flex items-center justify-center mr-1 h-6" >
                <span className="text-sm font-medium mr-1">
                  {dataUser?.data.fullname || dataUser?.data.account}
                </span>
                <PiUserListLight className="text-2xl ml-1" />
              </SheetTrigger>
              <SheetContent className="z-999 mt-6 max-sm:w-1/2 max-lg:w-1/3 max-sm:h-2/5 max-lg:h-2/6 rounded-xl">
                <SheetHeader>
                  <SheetTitle className="mb-2"></SheetTitle>
                  <SheetDescription>
                    <Button onClick={() => route.push('/user/profile')} className="w-full bg-inherit shadow-none  hover:bg-[#dadadaab] text-[var(--color-text-root)]">Quản lý tài khoản</Button>
                  </SheetDescription>
                  <SheetDescription>
                    <Button onClick={() => route.push('/order?slug=1')} className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]" >Đơn mua</Button>
                  </SheetDescription>
                  <SheetDescription>
                    <Button onClick={() => route.push('/cart')} className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]" >Danh sách giỏ hàng</Button>
                  </SheetDescription>
                  <SheetDescription>
                    {dataUser?.data.role.includes("seller") && dataUser.data.isSellerApproved ?
                      (<Button className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]" onClick={() => route.push(`/seller`)}>Quản lý cửa hàng</Button>)
                      :
                      (<Button className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]" onClick={() => route.push('/seller-register')}>Đăng ký kênh bán hàng</Button>)
                    }
                  </SheetDescription>
                  <SheetDescription>
                    <Button onClick={() => handleLogout()} className="w-full bg-inherit shadow-none text-[var(--color-text-root)] hover:bg-[#dadadaab]">
                      Đăng xuất
                    </Button>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
    </div>
  );
};
