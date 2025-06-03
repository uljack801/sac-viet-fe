"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";


export default function SellerRegister() {
    const route = useRouter()
    const { dataUser } = useAuth()

    return (

        !dataUser?.data.isSellerApproved  ?
            <div className="flex justify-center items-center pt-4 " >
                <div className="flex flex-col justify-center items-center bg-white w-2/3 rounded-sm py-10">
                    <Image src={'/register-seller.png'} width={240} height={240} alt="register-seller" className=" mt-4" />
                    <p className="mt-6 text-2xl font-medium">Chào mừng bạn đến với Sắc Việt!</p>
                    <p >Vui lòng cung cấp thông tin để thành lập tài khoản người bán trên Sắc Việt</p>
                    <Button onClick={() => route.push(`/seller-register/form/${dataUser?.data._id}`)} className="mt-10 bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] ">Bắt đầu đăng ký</Button>
                </div>
            </div>
            :
            <div className="flex justify-center items-center pt-4">
            <div className="flex flex-col justify-center items-center bg-white w-2/3 rounded-sm py-10">
                <Button onClick={() => route.push('/')} className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] mb-10">Quay lại Trang chủ</Button>
                <h1 className="text-3xl font-bold text-center text-neutral-400">Gửi yêu cầu thành công!</h1>
                <p className="mt-6 text-center text-neutral-300">
                    Cảm ơn bạn đã đăng ký trở thành Người bán trên <strong>Sắc Việt</strong>.
                    Hồ sơ của bạn đang được xem xét và chúng tôi sẽ phản hồi trong vòng <strong>1–2 ngày làm việc</strong>.Vui lòng kiểm tra email để cập nhật trạng thái xác minh.
                </p>
            </div>
            </div> 
    )
}