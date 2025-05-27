"use client"
import { ProductProps } from "@/app/utils/fetchProduct"
import Image from "next/image";
import { FiTrendingDown } from "react-icons/fi";
import { cn } from "@/lib/utils";
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
    <div className="grid grid-cols-4 mt-10">
      <div className="col-span-1 2xl:mr-10 ">
        <CategoryDetails />
        <p className="2xl:text-xl font-medium mt-6 xl:text-[16px]">Sắp xếp theo:</p>
        <OptionPrice setResultProducts={setResultProduct} />
      </div>
      <div className="col-span-3">
        <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 gap-2 ">
          {resultProduct?.data.length ?
            resultProduct?.data.map((value) => {
              return (
                <div onClick={() => route.push(`/product-details/${value._id}`)} key={`product-${value._id}`} className="relative col-span-1 p-1 rounded-sm shadow bg-white cursor-pointer" >
                  <div>
                    <Image src={'/do-tho/' + value.img[0]} alt={value.name} width={300}
                      height={300}
                      className="object-cover w-full h-full rounded-xs" />
                  </div>
                  <p className="line-clamp-2 text-[var(--color-text-root)]">{value.name}</p>
                  <span className={cn("bg-[#E2962B] text-xs text-white px-1", value.discount_percentage === 0 && "hidden")}>{value.discount_percentage}% giảm giá</span>
                  <div className="mt-6">
                    <div className="absolute bottom-1 ">
                      <p className="text-[var(--color-text-root)] font-medium flex justify-center items-center">{((value.price / 100) * (100 - value.discount_percentage)).toLocaleString("vi-VN")}đ {value.discount_percentage > 0 && <FiTrendingDown className="text-red-400 ml-1" />}</p>
                    </div>
                    <div className="absolute bottom-1 right-1">
                      <p className="text-xs flex justify-center items-center">đã bán {value.sold}</p>
                    </div>
                  </div>
                </div>
              )
            }) :
            <div className="col-span-4 flex flex-col justify-center items-center mt-20">
              <GiCardboardBox className="text-6xl" />
              <p>Chưa có sản phẩm nào trên sàn.</p>
              <p>Vui lòng chọn danh mục khác hoặc quay lại sau.</p>

            </div>
          }

        </div>
      </div>
      <div className="flex col-span-4 justify-center items-center my-10">
        {resultProducts && resultProducts.totalPages > 1 && <PaginationProducts listProducts={resultProducts} param={param.category} />}
      </div>
    </div>
  )
}