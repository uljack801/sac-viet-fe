"use client"

import { useAuth } from "@/app/AuthContext"
import { OrderProps } from "@/app/config/models/Order"
import { getProducts } from "@/app/utils/fetchProducts"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ReviewDialog } from "./ReviewDialog"
import { handleTag } from "@/app/helper/constant"


export type DataType = {
    _id: string;
    products: {
        quantity: number;
        product: {
            _id: string;
            seller_id: string;
            category_id: string;
            name: string;
            img: string[];
            video: string;
            sold: number;
            discount_percentage: number;
            price: number;
            color: string[];
            material: string[];
            dimensions: string;
            origin: string;
            handmade: boolean;
            warranty: string;
            care_instructions: string;
            description: string;
            inventory: number;
            tags: string[];
            status: boolean;
        } | undefined;
    }[];
    order_at: Date;
    address_ship: string;
    total_money_ship: number;
    status: string;
    payment_method: string;
    is_paid: boolean;
    is_review: boolean;
    paid_at: Date;
    cancelled_at: Date;
}[];


export const AllOrder = ({ dataOrder }: { dataOrder: OrderProps | undefined }) => {
    const { listProducts, setListProducts } = useAuth()
    const [mergedOrders, setMergedOrders] = useState<DataType>()

    const route = useRouter()
    useEffect(() => {
        getProducts({ setListProducts })
    }, [setListProducts])
    useEffect(() => {
        const data = dataOrder?.list_orders.map(order => ({
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
    }, [dataOrder?.list_orders, dataOrder, listProducts?.data])

    return (
        <div>
            <div className="grid grid-cols-7 text-sm bg-white p-6 items-center rounded-sm mb-1 ">
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
                        return acc + (product.quantity * (product.product.price / 100) * (100 - product.product.discount_percentage)) ;
                    }
                    return acc ;
                }, 0);

                return (
                    <div key={orders._id} className="p-6 mb-1 pb-24 rounded-sm bg-white relative">
                        <div className="flex justify-between mb-3">
                            <p className="font-medium">{handleTag(orders.status)}</p>
                        </div>
                        {orders.products.map(product => {
                            return (
                                product.product && <div key={`order-${orders._id}-product-${product.product?._id}`}>
                                    <div className="grid grid-cols-7 border p-2 m-1 rounded-xs items-center">
                                        <div className="col-span-3">
                                            <div className="flex my-2">
                                                <Image src={`${product.product?.img[0]}`} alt={`${product.product?.name}`} width={48} height={48} />
                                                <div className="flex items-center">
                                                    <p className="text-ellipsis line-clamp-1 mx-2 ">{product.product?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className=" mt-2 flex items-center justify-center">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((product.product.price / 100) * (100 - product.product.discount_percentage))}</div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex items-center justify-center mt-2 text-xl w-auto ">
                                                <span className="flex justify-center items-center w-6 text-sm"> {product.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="mt-2 flex items-center justify-center">
                                                <p className="">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((product.product.price / 100) * (100 - product.product.discount_percentage) * product.quantity)}</p>
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
                            <p>Phí vận chuyển: <span className="text-xl xl:text-sm ml-2 font-medium">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(orders.total_money_ship)}</span></p>

                        </div>
                        <div className="flex justify-end items-center mr-2 mt-2">
                            <p>
                                Thành tiền:
                                <span className="text-2xl ml-2 font-medium xl:text-xl">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalOrderPrice + orders.total_money_ship)}
                                </span>
                            </p>
                        </div>

                    </div>
                )
            })}

        </div>
    )
}