"use client"
import { ProductProps } from "@/app/utils/fetchProduct"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PaginationProducts } from "@/app/[category]/components/Pagination";

export const ResultProductsSearch = ({ resultProducts, search }: { resultProducts: ProductProps | null, search: string | null }) => {
  const route = useRouter()
  return (
    <div className="grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-2 gap-3 mt-10 ">
      {
        resultProducts?.data.map((value) => {
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
        })
      }

      <div className="flex col-span-6 justify-center items-center my-10">
        {resultProducts && resultProducts.totalPages > 1 && <PaginationProducts listProducts={resultProducts} search={search} />}
      </div>
    </div>
  )
}