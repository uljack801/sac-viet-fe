"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../AuthContext"
import { OrderProps } from "../config/models/Order"
import { getOrder } from "./components/fetchAllOrder"
import { useRouter, useSearchParams } from "next/navigation"
import { AllOrder } from "./components/AllOrder"
import { cn } from "@/lib/utils"
import { OrderFollowStatus } from "./components/OrderFollowStatus"
import { tabs } from "../helper/constant"

export default function Order() {
    const { accessToken } = useAuth()
    const [dataOrder, setDataOrder] = useState<OrderProps | undefined>()
    const searchParam = useSearchParams()
    const slugSearch = searchParam.get("slug") || "1"
    const route = useRouter()
    useEffect(() => {
        getOrder({ accessToken, setDataOrder })
    }, [accessToken])
    
    return (
        <div className="lg:mx-20 sm:mx-10 xl:mx-40">
            <div className="grid grid-cols-6 bg-white rounded-sm mt-28">
                {tabs.map((label, index) => (
                    <p
                        key={label.slug}
                        className={`col-span-1 2xl:p-6 xl:px-6 xl:py-2 xl:text-sm border flex justify-center items-center font-medium cursor-pointer ${slugSearch === label.slug && "bg-neutral-100"} ${index === 0 ? "rounded-l-sm" : index === tabs.length - 1 ? "rounded-r-sm" : ""}`}
                        onClick={() => route.push(`/order?slug=${label.slug}`)}
                    >
                        {label.type}
                    </p>
                ))}
            </div>
            <div className={cn(" w-full min-h-96 mt-2 rounded-sm mb-10", !dataOrder?.list_orders.length && "bg-white")}>
                {slugSearch === "1" && <AllOrder dataOrder={dataOrder} />}
                {slugSearch === "2" && <OrderFollowStatus dataOrder={dataOrder} status="pending" />}
                {slugSearch === "3" && <OrderFollowStatus dataOrder={dataOrder} status="shipped" />}
                {slugSearch === "4" && <OrderFollowStatus dataOrder={dataOrder} status="delivered" />}
                {slugSearch === "5" && <OrderFollowStatus dataOrder={dataOrder} status="cancelled" />}
                {slugSearch === "6" && <OrderFollowStatus dataOrder={dataOrder} status="returned" />}
            </div>
        </div>
    )
}

