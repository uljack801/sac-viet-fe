import { ProductProps } from "@/app/utils/fetchProduct"
import { useRouter } from "next/navigation";
import Image from "next/image";

export const TopProductsSold = ({ listProducts }: { listProducts: ProductProps | null }) => {
    const sortProducts = listProducts?.data.sort((a, b) => b.sold - a.sold)
    const route = useRouter()
    return (
        <div className=" w-full">
            <p className="text-3xl font-medium text-[var(--color-text-root)] flex justify-center items-center py-10">
                Top sản phẩm bán chạy
            </p>
            <div className="grid  xl:grid-cols-6 sm:grid-cols-4 gap-2">
                {sortProducts?.slice(0, 6).map((value) => {
                    return (
                        <div
                            key={`product-${value._id}`}
                            onClick={() =>
                                route.push(`/product-details/${value._id}`)
                            }
                            className="relative col-span-1 p-1 rounded-sm shadow bg-white cursor-pointer"
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
                    );
                })}
            </div>
        </div>

    )

}