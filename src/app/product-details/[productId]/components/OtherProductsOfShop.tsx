"use client"
import { useAuth } from "@/app/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FiTrendingDown } from "react-icons/fi"
import { MdNavigateNext } from "react-icons/md";


export const OtherProductsOfShop = ({ sellerID }: { sellerID: string | undefined }) => {
    const { listProducts } = useAuth()
    const otherProduct = listProducts?.data.filter(value => value.seller_id === sellerID).slice(0, 20)
    const route = useRouter();
    return (
        <div >
            <div className="flex justify-between items-center bg-white my-3 rounded-sm shadow">
            <p className="font-medium 2xl:text-2xl p-4 py-6 xl:text-xl ">Các sản phẩm khác của Shop</p>
            <p  className="text-sm flex items-center mr-10 cursor-pointer">xem tất cả <MdNavigateNext className="ml-1"/></p>
            </div>
            <Carousel >
                <CarouselContent >
                    {otherProduct?.map((value) => (
                        <CarouselItem key={`product -${value._id}`} className=" lg:basis-1/6"  onClick={() => route.push(`/product-details/${value._id}`)}>
                            <Card className="p-0 rounded-sm">
                                <CardContent className="p-0">
                                    <div className="relative p-1 rounded-sm shadow bg-white cursor-pointer" >
                                        <div>
                                            <Image src={value.img[0]} alt={value.name} width={300}
                                                height={300}
                                                className="object-cover w-full h-full rounded-xs" />
                                        </div>
                                        <p className="line-clamp-2 2xl:text-sm text-[var(--color-text-root)] xl:text-xs">{value.name}</p>
                                        <span className={cn("bg-[#E2962B] text-white px-1 2xl:text-xs xl:text-[10px]", value.discount_percentage === 0 && "hidden")}>{value.discount_percentage}% giảm giá</span>
                                        <div className="mt-6">
                                            <div className="absolute bottom-1 ">
                                                <p className="text-[var(--color-text-root)] font-medium flex justify-center items-center 2xl:text-lg xl:text-sm">  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price / 100) * (100 - value.discount_percentage))} {value.discount_percentage > 0 && <FiTrendingDown className="text-red-400 ml-1 2xl:text-xs xl:text-[10px]" />}</p>
                                            </div>
                                            <div className="absolute bottom-1 right-1">
                                                <p className="2xl:text-xs flex justify-center items-center xl:text-[10px]">đã bán {value.sold}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}

                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>

    )
}