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
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MdNavigateNext } from "react-icons/md";


export const OtherProductsOfShop = ({ sellerID }: { sellerID: string | undefined }) => {
    const { listProducts } = useAuth()
    const otherProduct = listProducts?.data.filter(value => value.seller_id === sellerID).slice(0, 20)
    const route = useRouter();
    return (
        <div >
            <div className="flex justify-between items-center bg-white my-3 rounded-sm shadow ">
                <p className="font-medium  p-4 py-6 max-sm:text-sm max-lg:text-lg max-xl:text-xl ">Các sản phẩm khác của Shop</p>
                <p className="text-sm flex items-center mr-10 cursor-pointer">xem tất cả <MdNavigateNext className="ml-1" /></p>
            </div>
            <Carousel >
                <CarouselContent >
                    {otherProduct?.map((value) => (
                        <CarouselItem key={`product -${value._id}`} className="max-sm:basis-1/2 max-lg:basis-1/4 max-xl:basis-1/5 basis-1/6 hover:scale-[1.03]" onClick={() => route.push(`/product-details/${value._id}`)}>
                            <Card className="p-0 rounded-sm  h-full ">
                                <CardContent className="p-0 h-full">
                                    <div className="relative p-1 h-full max-h-60" >
                                        <div className="h-2/3 ">
                                            <Image
                                                src={`${value.img[0]}`}
                                                alt={value.name}
                                                width={240}
                                                height={240}
                                                className="object-cover w-full h-full rounded-xs"
                                            />
                                        </div>
                                        <div className="h-1/3 flex flex-col justify-between">
                                            <p className="line-clamp-2 text-[var(--color-text-root)] max-sm:text-xs text-sm">{value.name}</p>
                                                <div className="flex justify-between items-center mx-1">
                                                    <p className="text-[var(--color-text-root)] font-medium flex justify-center items-center 2xl:text-lg lg:text-sm">
                                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price))}
                                                    </p>
                                                    <p className="text-sm max-sm:text-xs text-[var(--color-text-root)]">đã bán {value.sold}</p>
                                                </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}

                </CarouselContent>
                <CarouselPrevious  className="max-sm:hidden max-lg:hidden max-xl:hidden"/>
                <CarouselNext className="max-sm:hidden max-lg:hidden  max-xl:hidden" />
            </Carousel>
        </div>

    )
}