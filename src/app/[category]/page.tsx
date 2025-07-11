"use client"

import { useEffect, useState } from "react";
import { ProductListInCategory } from "./components/ProductList";
import { ProductProps } from "../utils/fetchCategory";
import { NEXT_PUBLIC_LOCAL } from "../helper/constant";
import { useParams } from "next/navigation";
import NotFound from "../not-found";

export default function Category() {
    const [resultProducts, setResultProducts] = useState<ProductProps | null>()
    const [notFound, setNotFound] = useState(true);
    const param = useParams()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/product-follow-category?typeCategory=${param.category}`, {
                    method: "GET",
                    cache: "no-store",
                });

                const result = await res.json();
                const data: ProductProps = result;
                if (res.status === 200) {
                    setResultProducts(data);
                } else {
                    setNotFound(false)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [param.category]);


    return (
        <div>
            {resultProducts && notFound &&
                <div className="pt-28 max-xl:mx-0 max-[1540px]:mx-36 mx-96">
                    <ProductListInCategory resultProducts={resultProducts} />
                </div>
            }
            {!notFound && <NotFound />}
        </div>
    )
}