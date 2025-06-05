"use client"
import { ProductProps } from "@/app/utils/fetchProduct"
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
            <div
              key={`product-${value._id}`}
              onClick={() =>
                route.push(`/product-details/${value._id}`)
              }
              className="relative col-span-1 p-1 rounded-sm shadow bg-white cursor-pointer hover:scale-[1.03]"
            >
              <div className="h-2/3 w-full">
                <Image
                  src={`${value.img[0]}`}
                  alt={value.name}
                  width={480}
                  height={480}
                  className="object-cover w-full h-full rounded-xs"
                />
              </div>
              <div className="h-1/3 flex flex-col justify-between">
                <p className="line-clamp-2 text-[var(--color-text-root)] 2xl:text-sm lg:text-xs">{value.name}</p>

                <div className="">
                  <div className="flex justify-between mx-1">
                    <p className="text-[var(--color-text-root)] font-medium flex justify-center items-center 2xl:text-lg lg:text-sm">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price))}
                    </p>
                    <p className="flex justify-center items-center 2xl:text-xs xl:text-[10px]">đã bán {value.sold}</p>
                  </div>
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