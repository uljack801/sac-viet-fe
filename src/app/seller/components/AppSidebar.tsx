"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { LuMessageSquareMore } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";

export function AppSidebar() {
  const route = useRouter()
  return (
    <Sidebar>
      <SidebarHeader >
        <div className="flex ml-8 items-center">
          <Image src={'/logo_.png'} alt="logo" width={60} height={60} />
          <p className="text-[var(--color-text-root)] font-medium text-2xl">Sắc Việt</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Quản lý trang bán hàng</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuButton onClick={() => route.push('/seller')}><AiOutlineHome />Trang chủ</SidebarMenuButton>
          <SidebarMenuButton onClick={() => route.push('/seller/manager-products')}><AiOutlineProduct />Danh sách sản phẩm</SidebarMenuButton>
          <SidebarMenuButton onClick={() => route.push('/seller/add-product')}><IoAddCircleOutline  />Thêm sản phẩm</SidebarMenuButton>
          <SidebarMenuButton onClick={() => route.push('/seller/manager-orders')}><BsBoxSeam />Quản lý đơn hàng</SidebarMenuButton>
          <SidebarMenuButton onClick={() => route.push('/seller')}><LuMessageSquareMore />Phản hồi khách hàng</SidebarMenuButton>
          <SidebarMenuButton onClick={() => route.push('/seller')}><IoSettingsOutline />Cài đặt shop</SidebarMenuButton>
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  )
}
