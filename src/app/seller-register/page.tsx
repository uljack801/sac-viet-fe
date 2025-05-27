"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";


export default function SellerRegister () {
    const route = useRouter()
    const { dataUser } = useAuth()
    
    return(
        <div className="flex justify-center items-center pt-4 ">
            <div className="flex flex-col justify-center items-center bg-white w-2/3 rounded-sm py-10">
            <Image src={'/register-seller.png'} width={240} height={240} alt="register-seller" className=" mt-4" />
            <p className="mt-6 text-2xl font-medium">Chào mừng bạn đến với Sắc Việt!</p>
            <p >Vui lòng cung cấp thông tin để thành lập tài khoản người bán trên Sắc Việt</p>
            <Button onClick={() => route.push(`/seller-register/form/${dataUser?.data._id}`)} className="mt-10 bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] ">Bắt đầu đăng ký</Button>
            </div>
        </div>
    )
}