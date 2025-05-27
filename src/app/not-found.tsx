"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function  NotFound(){
    const route = useRouter()
    return(
        <div className="flex justify-center items-center py-52">
            <div>
            <p className="text-9xl font-medium">404 Not Found</p>
            <div  className="flex justify-center items-center mt-16 mb-1">
            <Button className="bg-[#C95050] text-white hover:bg-[#c9505098]" onClick={()=>route.push("/") }>Quay về Trang chủ</Button>
            </div>
            </div>
        </div>
    )
}