import { ProductProps } from "@/app/utils/fetchCategory"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export const TopProductsSold = ({ listProducts }: { listProducts: ProductProps | null }) => {
    const [itemsToShow, setItemsToShow] = useState(12)
    useEffect(() => {
        const updateItemsShow = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setItemsToShow(6)
            } else if (width < 1024) {
                setItemsToShow(8)
            } else if (width < 1280) {
                setItemsToShow(10)
            } else {
                setItemsToShow(12)
            }
        }
        updateItemsShow();
        window.addEventListener("resize", updateItemsShow); 

        return () => window.removeEventListener("resize", updateItemsShow);
    }, [])

    const sortProducts = listProducts?.data.sort((a, b) => b.sold - a.sold)
    const route = useRouter()
    return (
        <div className="m-2">
            <p className="max-sm:text-xl max-sm:py-4 max-lg:text-2xl max-lg:py-6 max-xl:text-3xl max-xl:py-10 text-3xl py-10 font-medium text-[var(--color-text-root)] text-center">
                Top sản phẩm bán chạy
            </p>
            <div className="grid max-sm:grid-cols-2 max-lg:grid-cols-4 max-xl:grid-cols-5 grid-cols-6 gap-2">
                {sortProducts?.slice(0, itemsToShow).map((value) => {
                    return (
                        <div
                            key={`product-${value._id}`}
                            onClick={() =>
                                route.push(`/product-details/${value._id}`)
                            }
                            className="relative col-span-1 p-1 rounded-sm shadow bg-white cursor-pointer hover:scale-[1.03] min-h-60"
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
                                <p className="line-clamp-2 text-[var(--color-text-root)] max-sm:text-xs text-sm">{value.name}</p>
                                <div>
                                    <div className="flex justify-between items-center mx-1">
                                        <p className="text-[var(--color-text-root)] font-medium ">
                                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price))}
                                        </p>
                                        <p className="text-sm max-sm:text-xs">đã bán {value.sold}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

    )

}