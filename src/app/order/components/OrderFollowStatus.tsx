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
import { handleTag, NEXT_PUBLIC_LOCAL } from "@/app/helper/constant"



export const OrderFollowStatus = ({ dataOrder, status }: { dataOrder: OrderProps | undefined, status: string }) => {
    const { listProducts, setListProducts, accessToken } = useAuth()
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
    }, [dataOrder?.list_orders, status, dataOrder, listProducts?.data])

    const handleCancelledOrder = async (orderID: string) => {
        const order = mergedOrders?.find(order => order._id === orderID);
        const productIDs: { quantity: number, productID: string | undefined}[] = order?.products?.map(product => ({
            quantity: product.quantity,
            productID: product.product?._id
        })) || [];
        try {
            if(!accessToken) return 
            const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/cancell-order`, {
                method:"POST",
                headers: {
                    "Content-Type" :"application/json",
                    Authorization : `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    orderID,
                    productIDs
                })
            })
            if(!res) return console.log("Hủy đơn thất bại");
            return setMergedOrders(prev => prev?.filter(order => order._id !== orderID))
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <div className="grid grid-cols-7 text-sm bg-white p-6 items-center rounded-sm mb-1 max-sm:hidden max-lg:hidden max-xl:text-lg border">
                <p className="col-span-3 font-medium ">Danh sách đơn hàng</p>
            </div>
            {mergedOrders?.map(orders => {
                const totalOrderPrice = orders.products.reduce((acc, product) => {
                    if (product.product) {
                        return acc + (product.quantity * (product.product.price / 100) * (100 - product.product.discount_percentage));
                    }
                    return acc;
                }, 0);

                return (
                    <div key={orders._id} className="p-6 mb-1 rounded-sm bg-white relative max-sm:p-2 max-xl:p-4 border">
                        <p className="font-medium max-sm:text-sm max-xl:text-lg">{handleTag(orders.status)}</p>
                        {orders.products.map(product => {
                            return (
                                product.product && <div key={`order-${orders._id}-product-${product.product?._id}`} >
                                    <div className=" border m-1 items-center rounded-sm" onClick={() => route.push(`/product-details/${product.product?._id}`)}>
                                        <div className="flex my-2 max-lg:mx-2 max-xl:mx-2 max-[1540px]:mx-4 ">
                                            <Image src={`${product.product?.img[0]}`} alt={`${product.product?.name}`} width={48} height={48} className="max-xl:w-48" />
                                            <div className="flex flex-col justify-between ">
                                                <p className="text-ellipsis line-clamp-1 mx-2 max-sm:text-xs text-sm">{product.product?.name}</p>
                                                <div className="flex items-center justify-end max-sm:text-sm max-xl:text-lg mr-1">
                                                    <p>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((product.product.price / 100) * (100 - product.product.discount_percentage))}</p>
                                                    <p className="text-sm mx-2">SL:{product.quantity}</p>
                                                    <p className="">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((product.product.price / 100) * (100 - product.product.discount_percentage) * product.quantity)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="flex justify-end items-center max-sm:text-sm max-xl:text-lg">
                            <p>Phí vận chuyển: <span className="ml-2 font-medium">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(orders.total_money_ship)}</span></p>
                        </div>
                        <div className="flex justify-end items-center max-sm:text-sm max-xl:text-lg">
                            <p>
                                Thành tiền:
                                <span className="ml-2 font-medium max-sm:text-lg">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalOrderPrice + orders.total_money_ship)}
                                </span>
                            </p>
                        </div>
                        <div className="flex justify-end mt-2">
                            {orders.status === "delivered" && orders.is_review !== false && (
                                <ReviewDialog mergedOrders={mergedOrders} ordersID={orders._id} />
                            )}
                            {orders.is_review === true &&
                                <Button className="max-sm:text-xs mr-1 bg-white border text-[var(--color-button)] border-[var(--color-button)] hover:bg-neutral-100">
                                    Đã đánh giá
                                </Button>
                            }
                            {orders.status === "pending" &&
                                <Button className="bg-white border text-[var(--color-button)] border-[var(--color-button)] hover:bg-neutral-100 mr-2" onClick={() => handleCancelledOrder(orders._id)}>Hủy đơn</Button>
                            }

                            <Button className="max-sm:text-xs bg-white border text-[var(--color-button)] border-[var(--color-button)] hover:bg-neutral-100">
                                Liên hệ người bán
                            </Button>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}