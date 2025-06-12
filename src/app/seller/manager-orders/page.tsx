
"use client"

import { useAuth } from "@/app/AuthContext"
import { OrderProps } from "@/app/config/models/Order"
import { useEffect, useState } from "react"
import { getAllOrder } from "../components/getAllOrder"
import { useAuthSeller } from "../AuthContext"
import moment from 'moment';
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { fetchUserOrder } from "./components/fetchInfoUserOrder"
import { UserData } from "@/app/components/type/user.type"
import { fetchUserAddressOrder } from "./components/fetchUserAddressOrder"
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant"
import { TfiReload } from "react-icons/tfi";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type ListOrderProps = {
    _id: string;
    products: [
        {
            productID: string;
            quantity: number;
            weight: number,
            productName: string,
        },

    ];
    shipping_fees: { [sellerId: string]: number };
    seller_id: string,
    order_at: Date;
    address_ship: string;
    total_money_ship: number;
    status: string;
    payment_method: string;
    is_paid: boolean;
    paid_at: Date;
    is_review: boolean;
    cancelled_at: Date;
    note: string,
    totalPay: number
}

export type AddressProps = {
    _id: string;
    phone: string;
    name: string;
    address: string;
    is_default: boolean;
}
export default function ManagerOrders() {
    const { accessToken, listProducts } = useAuth()
    const { infoSeller } = useAuthSeller()
    const [dataOrder, setDataOrder] = useState<OrderProps[] | undefined>()
    const [sortProduct, setSortProduct] = useState<string | undefined>()

    useEffect(() => {
        if (infoSeller && accessToken) {
            {
                getAllOrder({ accessToken, sellerID: infoSeller.data._id, setDataOrder, sortProduct })
            }
        }
    }, [accessToken, infoSeller, sortProduct])



    const handleCreateOrder = async (result: ListOrderProps, idOrderUser: string) => {
        if (accessToken && idOrderUser) {
            const userOrderData: UserData = await fetchUserOrder(accessToken, idOrderUser)
            const findUserAddress: AddressProps = await fetchUserAddressOrder(accessToken, idOrderUser, result.address_ship)
            if (infoSeller && userOrderData && findUserAddress) {
                const createOrder = {
                    products: result.products.map(value => ({
                        name: value.productName,
                        weight: value.weight / 1000,
                        quantity: value.quantity,
                    })),
                    order: {
                        id: result._id,
                        pick_name: infoSeller?.data.nameShop,
                        pick_address: infoSeller?.data.address.split(', ')[0],
                        pick_province: infoSeller?.data.address.split(', ')[3],
                        pick_district: infoSeller?.data.address.split(', ')[2],
                        pick_ward: infoSeller?.data.address.split(', ')[1],
                        pick_tel: infoSeller?.data.phoneNumber,

                        tel: findUserAddress.phone,
                        name: findUserAddress.name,
                        address: findUserAddress.address.split(', ')[0],
                        province: findUserAddress.address.split(', ')[3],
                        district: findUserAddress.address.split(', ')[2],
                        ward: findUserAddress.address.split(', ')[1],
                        email: userOrderData.data.email,
                        hamlet: findUserAddress.address.split(', ')[0],
                        is_freeship: "1",
                        pick_money: result.totalPay + result.total_money_ship,
                        value: result.totalPay,
                        note: result.note || "",
                        transport: "road",
                        pick_option: "cod",
                        return_phone: infoSeller?.data.phoneNumber,
                        return_address: infoSeller?.data.address.split(', ')[0],
                        return_district: infoSeller?.data.address.split(', ')[2],
                        return_ward: infoSeller?.data.address.split(', ')[1],
                        client_order_code: result._id,
                        return_email: infoSeller.data.email,
                    }
                };

                if (createOrder) {
                    try {
                        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/ghtk/create-order`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ orderData: createOrder })
                        })
                        const data = await res.json();

                        console.log(data.data.order.tracking_id);

                        if (res.status === 200) {
                            try {
                                const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/change-status-order?order-id=${result._id}&tracking-id=${data.data.order.tracking_id}`, {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${accessToken}`
                                    }
                                })
                                if (res.status === 200) {
                                    getAllOrder({ accessToken, sellerID: infoSeller.data._id, setDataOrder, sortProduct })
                                }
                            } catch (error) {
                                console.log(error);

                            }

                        }
                    } catch (error) {
                        console.log(error);

                    }
                    // try {
                    //     const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/change-status-order?order-id=${result._id}`, {
                    //         method: "PATCH",
                    //         headers: {
                    //             "Content-Type": "application/json",
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     })
                    //     if (res.status === 200) {
                    //         getAllOrder({ accessToken, sellerID: infoSeller.data._id, setDataOrder, sortProduct })
                    //     }
                    // } catch (error) {
                    //     console.log(error);

                    // }
                }
            }

        }
    }

    const handleReload = () => {
        setSortProduct('')
        if (accessToken && infoSeller) {
            getAllOrder({ accessToken, sellerID: infoSeller.data._id, setDataOrder, sortProduct })
        }
    }
    const handleCancel = async (tracking: string) => {
        try {
            const resGHTK = await fetch(`${NEXT_PUBLIC_LOCAL}/api/ghtk/cancel-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tracking
                })
            })
            if (!resGHTK) return console.log("Hủy đơn thất bại");
        } catch (error) {
            console.log(error);

        }

    }

    return (
        <div className="2xl:p-10 xl:p-4 ">
            <p className="text-2xl font-medium">Danh sách Đơn Hàng</p>
            <div className="flex justify-end mb-2">
                <Select value={sortProduct} onValueChange={(value) => {
                    setSortProduct(value);
                }}>
                    <SelectTrigger className="w-[180px] mr-2 bg-white">
                        <SelectValue placeholder="Sắp xếp sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="pending">Đang xử lý</SelectItem>
                            <SelectItem value="shipped">Vận chuyển</SelectItem>
                            <SelectItem value="delivered">Hoàn thành</SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
                            <SelectItem value="returned">Trả hàng/hoàn tiền</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <TfiReload onClick={handleReload} className="text-xl m-2" title="tải lại dữ liệu" />
            </div>
            <div className=" bg-[#fafafa] p-2 border rounded-sm mt-4">
                <div className="grid grid-cols-12 items-center mb-4 border xl:text-xs 2xl:text-sm">
                    <p className="flex justify-center border-r p-2 col-span-2 ">Mã đơn hàng</p>
                    <p className="flex justify-center border-r p-2">Ngày đặt</p>
                    <p className="flex justify-center border-r p-2 col-span-5">Danh sách sản phẩm </p>
                    <p className="flex justify-center border-r p-2">PT Thanh toán</p>
                    <p className="flex justify-center border-r p-2">Trạng thái</p>
                    <p className="flex justify-center border-r p-2">Duyệt đơn</p>
                    <p className="flex justify-center  p-2">Hủy đơn</p>

                </div>
                {dataOrder?.map(order => (
                    order.list_orders.map(result => {
                        return (
                            <div key={result._id}>
                                <div className="grid grid-cols-12 items-center mb-1 border xl:text-xs 2xl:text-sm">
                                    <p className="flex justify-center items-center col-span-2 border-r text-xs h-full">{result.tracking}</p>
                                    <p className="flex justify-center items-center border-r text-xs h-full">{moment(result.order_at).utcOffset(7).format("DD/MM/YYYY HH:mm")}</p>
                                    <div className="col-span-5 items-center h-full ml-1">
                                        {listProducts?.data.map(product => (
                                            result.products.map(value => {
                                                if (value.productID === product._id)
                                                    return (
                                                        <div key={product._id} className=" border-r" >
                                                            <div className="flex py-1 ">
                                                                <Image src={product.img[0]} alt={product.name} width={48}
                                                                    height={48}
                                                                    className="object-cover" />
                                                                <p className="text-xs ml-1 mr-2 line-clamp-2">{product.name}</p>
                                                            </div>
                                                            {result.note &&
                                                                <div>
                                                                    <span className="text-xs font-medium mr-2">Ghi chú:</span>
                                                                    <span className="text-red-400">{result.note}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    )
                                            })
                                        ))
                                        }
                                    </div>
                                    <p className="flex justify-center items-center h-full border-r ">{result.payment_method}</p>
                                    <p className="flex justify-center items-center h-full border-r ">{result.status}</p>
                                    <div className="flex justify-center items-center h-full border-r">
                                        {result.status === "pending" ? <Button className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]" onClick={() => handleCreateOrder(result, order.user)}>Xác nhận</Button> : "Đã xác nhận"}
                                    </div>
                                    <div className="flex justify-center items-center h-full ">
                                        {result.status === "shipped" ? <Button className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]" onClick={() => handleCancel(result.tracking)}>Hủy</Button> : "Đã xác nhận"}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ))}
            </div>
        </div>
    )
}