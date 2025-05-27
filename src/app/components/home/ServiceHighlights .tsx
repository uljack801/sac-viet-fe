"use client"

import { MdLocalShipping } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import { HiMenuAlt2 } from "react-icons/hi";
import { PiPercentBold } from "react-icons/pi";

export const ServiceHighlights = () => {
    return (
        <div className="grid grid-cols-4 gap-4 py-20 text-[var(--color-text-root)]">
            <div className="bg-[var(--color-background-main)] flex flex-col justify-center items-center rounded-2xl py-4 ">
                <MdLocalShipping className="text-4xl" />
                <span className="p-4 text-sm font-medium text-center">Hỗ trợ <strong>giao hàng tận nhà</strong></span>
            </div>
            <div className="bg-[var(--color-background-main)] flex flex-col justify-center  items-center rounded-2xl py-4 ">
                <TfiReload className="text-4xl" />
                <span className="p-4 text-sm font-medium text-center">Đổi trả <strong>MIỄN PHÍ</strong> <br /> Trong vòng <strong>15 NGÀY</strong></span>
            </div>
            <div className="bg-[var(--color-background-main)] flex flex-col justify-center  items-center rounded-2xl py-4">
                <div className="text-4xl flex"><span className="font-medium">đ</span><HiMenuAlt2 /></div>
                <span className="p-4 text-sm font-medium text-center">  <span>Tiến hành <strong>THANH TOÁN</strong> <br /> Với nhiều <strong>PHƯƠNG THỨC</strong></span></span>
            </div>
            <div className="bg-[var(--color-background-main)] flex flex-col justify-center  items-center rounded-2xl py-4 ">
               <div className="text-4xl "><PiPercentBold /></div>
                <span className="p-4 text-sm font-medium text-center"><strong>100% HOÀN TIỀN </strong><br /> nếu sản phẩm lỗi</span></div>
        </div>

    )
}