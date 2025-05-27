"use client"
import { FaTools } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function News() {
    const route = useRouter()
    return (
        <div className="w-screen h-full flex flex-col justify-center items-center">
            <FaTools className="text-6xl mb-10 "/>
            <h2 className="text-xl  font-semibold">Trang đang được phát triển!</h2>
            <p className=" mb-4">Chúng tôi đang nỗ lực hoàn thiện trang này. Vui lòng quay lại sau.</p>
            <Button className="bg-white text-[var(--color-text-root)] hover:text-[var(--color-text-root) hover:bg-neutral-100" onClick={() => route.push('/')}>Quay lại trang chủ</Button>
        </div>
    )
}