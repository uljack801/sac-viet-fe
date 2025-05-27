"use client"

import { useAuth } from "@/app/AuthContext"
import { OrderProps } from "@/app/config/models/Order"
import { getProducts } from "@/app/utils/fetchProducts"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ReviewDialog } from "./ReviewDialog"
import { DataType } from "./AllOrder"
import { handleTag } from "@/app/helper/constant"



export const OrderFollowStatus = ({ dataOrder, status }: { dataOrder: OrderProps | undefined , status: string}) => {
    const { listProducts, setListProducts } = useAuth()
    const [mergedOrders, setMergedOrders] = useState<DataType>()

    const route = useRouter()
    useEffect(() => {
        getProducts({ setListProducts })
    }, [setListProducts])
    useEffect(() => {
        const data = dataOrder?.list_orders.filter(order => order.status === status).map(order => ({
            ...order,
            products: order.products.map(p => {
                const matchedProduct = listProducts?.data.find(product => product._id === p.productID);
                return (
                    {
                        quantity: p.quantity,
                        product: matchedProduct,
                    }
                )
            })
        }))
        const mergedOrders = data?.reverse()
        setMergedOrders(mergedOrders)
    }, [dataOrder?.list_orders, status ,dataOrder, listProducts?.data])

    return (
        <div>
            <div className="grid grid-cols-7 text-sm bg-white p-6 items-center rounded-sm mb-1">
                <p className="col-span-3 text-2xl font-medium xl:text-xl">Danh sách đơn hàng</p>
                <div className="col-span-1 text-neutral-400 text-center">
                    <p>Đơn giá</p>
                </div>
                <div className="col-span-1 text-neutral-400 text-center">
                    <p>Số lượng</p>
                </div>  <div className="col-span-1 text-neutral-400 text-center">
                    <p>Số tiền</p>
                </div>
                <div className="col-span-1 text-neutral-400 text-center">
                    <p>Thao tác</p>
                </div>
            </div>
            {mergedOrders?.map(orders => {
                const totalOrderPrice = orders.products.reduce((acc, product) => {
                    if (product.product) {
                        return acc + (product.quantity * product.product.price + orders.total_money_ship);
                    }
                    return acc;
                }, 0);

                return (
                    <div key={orders._id} className="p-6 mb-1 pb-24 rounded-sm bg-white relative">
                        <div className="flex justify-between">
                            <p className="font-medium mb-3">{handleTag(orders.status)}</p>
                        </div>
                        {orders.products.map(product => {
                            return (
                                product.product && <div key={`order-${orders._id}-product-${product.product?._id}`}>
                                    <div className="grid grid-cols-7 border p-2 m-1 rounded-xs items-center">
                                        <div className="col-span-3">
                                            <div className="flex my-2">
                                                <Image src={`/do-tho/${product.product?.img[0]}`} alt={`${product.product?.name}`} width={48} height={48} />
                                                <div className="flex items-center">
                                                    <p className="text-ellipsis line-clamp-1 mx-2 ">{product.product?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className=" mt-2 flex items-center justify-center">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.product.price)}</div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex items-center justify-center mt-2 text-xl w-auto ">
                                                <span className="flex justify-center items-center w-6 text-sm"> {product.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="mt-2 flex items-center justify-center">
                                                <p className="">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((product.quantity * product.product.price))}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="mt-2 flex items-center justify-center">
                                                <p className="cursor-pointer font-medium" onClick={() => route.push(`/product-details/${product.product?._id}`)} >Mua lại</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 mr-10 mb-6 flex gap-4">
                                        {orders.status === "cancelled" && orders.is_review !== true && (
                                            <ReviewDialog mergedOrders={mergedOrders} ordersID={orders._id} />
                                        )}
                                        {orders.is_review === true &&
                                            <Button className="px-10 py-5 bg-white border text-[var(--color-button)] border-[var(--color-button)] hover:bg-neutral-100">
                                                Đã đánh giá
                                            </Button>
                                        }
                                        <Button className="px-10 py-5 bg-white border text-[var(--color-button)] border-[var(--color-button)] hover:bg-neutral-100">
                                            Liên hệ người bán
                                        </Button>
                                    </div>

                                </div>
                            )
                        })}
                        <div className="flex justify-end items-center mr-2 mt-6">
                            <p>Phí vận chuyển: <span className="text-xl ml-2 font-medium xl:text-sm">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(orders.total_money_ship)}</span></p>

                        </div>
                        <div className="flex justify-end items-center mr-2 mt-2">
                            <p>
                                Thành tiền:
                                <span className="text-2xl ml-2 font-medium xl:text-xl">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalOrderPrice)}
                                </span>
                            </p>
                        </div>

                    </div>
                )
            })}

        </div>
    )
}