"use client"
import { ProductProps } from "@/app/utils/fetchCategory"
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { OptionPrice } from "./OptionPrice";
import { PaginationProducts } from "./Pagination";
import { GiCardboardBox } from "react-icons/gi";
import CategoryDetails from "./CategoryDetails";
import { useState } from "react";

export const ProductListInCategory = ({ resultProducts }: { resultProducts: ProductProps | null }) => {
  const route = useRouter()
  const [resultProduct, setResultProduct] = useState<ProductProps | null>(resultProducts)
  const param = useParams()
  return (
    <div className="grid grid-cols-4 m-2">
      <div className="col-span-1 lg:mr-4 sm:mr-2 max-sm:hidden">
        <CategoryDetails />
        <p className="font-medium my-4 max-lg:text-xl">Sắp xếp theo:</p>
        <OptionPrice setResultProducts={setResultProduct} />
      </div>
      <div className="col-span-3 max-sm:col-span-4">
        <div className="hidden max-sm:block">
          <p className="text-center font-medium">Danh sách sản phẩm</p>
        <OptionPrice setResultProducts={setResultProduct}/>
        </div>
        <div className="grid max-sm:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 grid-cols-4 gap-2 m-2">
          {resultProduct?.data.length ?
            resultProduct?.data.map((value) => {
              return (
                <div
                  key={`product-${value._id}`}
                  onClick={() =>
                    route.push(`/product-details/${value._id}`)
                  }
                  className="relative col-span-1 p-1 rounded-sm shadow bg-white cursor-pointer hover:scale-[1.03]  min-h-60"
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
            }) :
            <div className=" max-sm:col-span-2 max-lg:col-span-3 max-xl:col-span-4 col-span-4 flex flex-col justify-center items-center mt-20">
              <GiCardboardBox className="text-6xl" />
              <p>Chưa có sản phẩm nào trên sàn.</p>
              <p>Vui lòng chọn danh mục khác hoặc quay lại sau.</p>

            </div>
          }

        </div>
      </div>
      <div className="flex max-sm:col-span-4 max-lg:col-span-4 max-xl:col-span-4 col-span-4 justify-center items-center my-10">
        {resultProducts && resultProducts.totalPages > 1 && <PaginationProducts listProducts={resultProducts} param={param.category} />}
      </div>
    </div>
  )
}