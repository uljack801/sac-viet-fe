"use client"
import { ProductProps } from "@/app/utils/fetchCategory"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";

export const ProductList = ({ listProducts }: { listProducts: ProductProps | null }) => {
  const route = useRouter()
  const [addProducts, setAddProducts] = useState(36);
  useEffect(() => {
    const updateItemsShow = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setAddProducts(20)
      } else if (width < 1024) {
        setAddProducts(24)
      } else if (width < 1280) {
        setAddProducts(30)
      } else (
        setAddProducts(36)
      )
    }
    updateItemsShow()
    window.addEventListener('resize', updateItemsShow)
    return () => window.removeEventListener('resize', updateItemsShow)
  }, [])

  return (
    <div>
      <div className="grid max-sm:grid-cols-2 max-lg:grid-cols-4 max-xl:grid-cols-5 grid-cols-6 gap-2 max-xl:mx-2">
        {listProducts?.data.sort(() => Math.random() - 0.5).slice(0, addProducts).map((value) => {
          return (
            <div
              key={`product-${value._id}`}
              onClick={() =>
                route.push(`/product-details/${value._id}`)
              }
              className="relative col-span-1 p-1 rounded-sm shadow bg-white cursor-pointer hover:scale-[1.03] max-h-60"
            >
              <div className="h-2/3 w-full">
                <Image
                  src={`${value.img[0]}`}
                  alt={value.name}
                  width={240}
                  height={240}
                  loading="lazy"
                  className="object-cover w-full h-full rounded-xs"
                />
              </div>
              <div className="h-1/3 flex flex-col justify-between">
                <p className="line-clamp-2 text-[var(--color-text-root)] text-sm max-sm:text-xs">{value.name}</p>
                <div className="flex justify-between mx-1  items-center">
                  <p className="text-[var(--color-text-root)] font-medium">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price))}
                  </p>
                  <p className="text-sm max-sm:text-xs">đã bán {value.sold}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="text-center">
        <Button className="mt-10 bg-white text-[var(--color-text-root)] hover:text-[var(--color-text-root) hover:bg-neutral-100 p-6" onClick={() => setAddProducts(addProducts + 6)}>Xem thêm sản phẩm</Button>
      </div>
    </div>
  )
}