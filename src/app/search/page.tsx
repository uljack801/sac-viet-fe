"use client"

import { ParamValue } from "next/dist/server/request/params";
import { NEXT_PUBLIC_LOCAL } from "../helper/constant";
import { ProductProps } from "../utils/fetchCategory";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ResultProductsSearch } from "./components/ResultProductsSearch";
import { GiCardboardBox } from "react-icons/gi";

export default function Search() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [resultProducts, setResultProducts] = useState<ProductProps>()
    const paramPage = useSearchParams();

  useEffect(() => {
    const getProductSearch = async (param: ParamValue) => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/search?search=${param}&page=${paramPage.get("page") || 1}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Unauthorized");
        const data: ProductProps = await res.json();
        return setResultProducts(data)

      } catch (error) {
        console.log(error);
        return null;
      }
    };

    if (search) {
      getProductSearch(search)
    }
  }, [search, setResultProducts, paramPage])
  
  return (
    <div className="pt-28 2xl:mx-52 xl:mx-40 lg:mx-32 sm:mx-20">
      <p className="text-3xl font-bold text-[var(--color-text-root)] flex justify-center items-center my-10 p-6 rounded-sm shadow bg-white">Kết quả tìm kiếm &quot;{search}&quot;</p>
      {resultProducts?.data.length ? <ResultProductsSearch resultProducts={resultProducts} search={search} /> :
        <div className="col-span-4 flex flex-col justify-center items-center mt-20">
          <GiCardboardBox className="text-6xl" />
          <p>Chưa có sản phẩm {search} nào trên sàn.</p>
          <p>Vui lòng tìm sản phẩm khác hoặc quay lại sau.</p>
        </div>}
    </div>
  );
}
