"use client"

import { Button } from "@/components/ui/button"
import { useAuthSeller } from "../AuthContext"
import { useRouter } from "next/navigation"

export function HeaderSeller () {
    const { infoSeller } = useAuthSeller()
    const route = useRouter()
    
    return(
        <div className="bg-[#fafafa] w-full py-6 border-b">
            <div className="flex justify-between">
            <p className="2xl:text-2xl xl:text-xl font-medium ml-20">Quản lý cửa hàng: {infoSeller?.data.nameShop}</p>
            <Button onClick={() => route.push('/') } className="mr-20 bg-white text-[var(--color-text-root)] border-2  hover:bg-[#F9F7F1] hover:text-[var(--color-text-root)]">Quay lại trang mua sắm !</Button>
            </div>
        </div>
    )
}