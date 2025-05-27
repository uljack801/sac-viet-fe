"use client"
import { ProductProps } from "@/app/utils/fetchProduct"
import { FiTrendingDown } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

export const ProductList = ({ listProducts }: { listProducts: ProductProps | null }) => {
  const route = useRouter()
  const [addProducts, setAddProducts] = useState(36);
  return (
    <div>
      <div className="grid grid-cols-6 gap-2">
        {listProducts?.data.sort(() => Math.random() - 0.5).slice(0, addProducts).map((value) => {

          return (
            <div onClick={() => route.push(`/product-details/${value._id}`)} key={`product-${value._id}`} className="relative col-span-1 p-1 rounded-sm shadow bg-white cursor-pointer" >
              <div>
                <Image src={'/do-tho/' + value.img[0]} alt={value.name} width={300}
                  height={300}
                  className="object-cover w-full h-full rounded-xs" />
              </div>
              <p className="line-clamp-2 text-[var(--color-text-root)] 2xl:text-sm xl:text-xs">{value.name}</p>
              <span className={cn("bg-[#E2962B] 2xl:text-xs xl:text-[10px] text-white px-1", value.discount_percentage === 0 && "hidden")}>{value.discount_percentage}% giảm giá</span>
              <div className="mt-6">
                <div className="absolute bottom-1 ">
                  <p className="text-[var(--color-text-root)] font-medium flex justify-center items-center 2xl:text-lg xl:text-sm">  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price))} {value.discount_percentage > 0 && <FiTrendingDown className="text-red-400 ml-1 2xl:text-sm xl:text-xs" />}</p>
                </div>
                <div className="absolute bottom-1 right-1">
                  <p className="2xl:text-xs flex justify-center items-center xl:text-[10px]">đã bán {value.sold}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-center w-full">
        <Button className="mt-10 bg-white text-[var(--color-text-root)] hover:text-[var(--color-text-root) hover:bg-neutral-100 p-6" onClick={() => setAddProducts(addProducts + 6)}>Xem thêm sản phẩm</Button>
      </div>
    </div>
  )
}