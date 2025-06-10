"use client"

import {  useEffect, useState } from "react"
import { useAuthSeller } from "./AuthContext"
import { useAuth } from "../AuthContext"
import { AiOutlineProduct } from "react-icons/ai";
import { OrderProps } from "../config/models/Order"
import { getAllOrder } from "./components/getAllOrder"
import { AiOutlineFileDone } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
import { Button } from "@/components/ui/button"
import { PiKeyReturnThin } from "react-icons/pi";
import { RiCustomerService2Line } from "react-icons/ri";
import { useRouter } from "next/navigation"

export default function HomeSeller() {
    const { accessToken } = useAuth();
    const { infoSeller } = useAuthSeller()
    const [dataOrder, setDataOrder] = useState<OrderProps[] | undefined>()
    const [filterType, setFilterType] = useState('day');
    const route = useRouter()

    useEffect(() => {
        if (infoSeller && accessToken) {
            {
                getAllOrder({ accessToken, sellerID: infoSeller.data._id, setDataOrder })
            }
        }
    }, [accessToken, infoSeller])

    const totalOrderPending = dataOrder?.reduce((total, value) => {
        const count = value.list_orders.filter(order => order.status === 'pending').length;
        return total + count;
    }, 0);
    const totalOrderDone = dataOrder?.reduce((total, value) => {
        const count = value.list_orders.filter(order => order.status === 'delivered').length;
        return total + count;
    }, 0);

    const now = new Date();
    const totalDeliveredPay = dataOrder?.reduce((total, value) => {
        const count = value.list_orders
            .filter(order => {
                if (order.status !== 'delivered') return false;

                const createdAt = new Date(order.order_at);

                if (filterType === 'day') {
                    return createdAt.toDateString() === now.toDateString();
                }

                if (filterType === 'week') {
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);

                    return createdAt >= startOfWeek && createdAt <= endOfWeek;
                }

                if (filterType === 'month') {
                    return (
                        createdAt.getMonth() === now.getMonth() &&
                        createdAt.getFullYear() === now.getFullYear()
                    );
                }

                return false;
            })
            .reduce((acc, curr) => acc + curr.totalPay, 0);

        return total + count;
    }, 0);
    const totalOrderReturn = dataOrder?.reduce((total, value) => {
        const count = value.list_orders.filter(order => order.status === 'cancelled' || order.status === 'returned').length;
        return total + count;
    }, 0);

    return (
        <div className="">
            <div className="grid grid-cols-3 mt-10 gap-4">
                <div className="p-6 bg-white rounded-xl" onClick={() => route.push('/seller/manager-products')}>
                    <span className="flex items-center text-xl font-medium"><AiOutlineProduct className="text-4xl mr-2" /> Tổng số lượng sản phẩm </span>
                    <p className="text-3xl font-medium flex justify-center mt-2">{infoSeller?.data.totalProducts.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-white rounded-xl" onClick={() => route.push('/seller/manager-orders')}>
                    <span className="flex items-center text-xl font-medium"><TfiReload className="text-4xl mr-2" />Đơn hàng đang xử lý: </span>
                    <p className="text-3xl font-medium flex justify-center mt-2">{(totalOrderPending)?.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-white rounded-xl">
                    <span className="flex items-center text-xl font-medium"><AiOutlineFileDone className="text-4xl mr-2" />Tổng đơn hàng: </span>
                    <p className="text-3xl font-medium flex justify-center mt-2">{infoSeller?.data.totalOrders.toLocaleString()}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 mt-4 gap-4">
                <div className="p-6 bg-white rounded-xl">
                    <span className="flex items-center text-xl font-medium"><AiOutlineFileDone className="text-4xl mr-2" />Doanh thu: </span>
                    <p className="text-3xl font-medium flex justify-center mt-2">{(totalDeliveredPay)?.toLocaleString()}    VND</p>
                    <div className="items-center justify-between mt-4 grid grid-cols-3 gap-1">
                        <Button className="bg-neutral-200 text-white hover:bg-neutral-400/50 w-full" onClick={() => setFilterType('day')} >Ngày</Button>
                        <Button className="bg-neutral-200 text-white hover:bg-neutral-400/50" onClick={() => setFilterType('week')}>Tuần</Button>
                        <Button className="bg-neutral-200 text-white hover:bg-neutral-400/50" onClick={() => setFilterType('month')}>Tháng</Button>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-xl">
                    <span className="flex items-center text-xl font-medium"><PiKeyReturnThin className="text-4xl mr-2" />Tỷ lệ hoàn trả/hủy đơn: </span>
                    <p className="text-3xl font-medium flex justify-center mt-2">  {totalOrderReturn && totalOrderDone
                        ? (totalOrderReturn / totalOrderDone).toLocaleString(undefined, {
                            style: 'percent',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })
                        : '0%'}</p>
                </div>
                <div className="p-6 bg-white rounded-xl">
                    <span className="flex items-center h-full justify-center text-xl font-medium"><RiCustomerService2Line className="text-4xl mr-2" />Chăm sóc khách hàng </span>

                </div>
            </div>

        </div>
    );
}
