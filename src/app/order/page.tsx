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
        <div className="max-sm:p-2 max-lg:p-4 max-xl:p-10 max-[1540px]:px-36 px-96">
            <div className="grid grid-cols-6 bg-white rounded-sm mt-28">
                {tabs.map((label, index) => (
                    <p
                        key={label.slug}
                        className={`max-sm:text-xs max-sm:p-1 max-lg:p-2 max-lg:text-sm max-xl:p-4 max-xl:text-sm p-4 text-sm col-span-1 border flex justify-center items-center text-center font-medium cursor-pointer ${slugSearch === label.slug && "bg-neutral-100"} ${index === 0 ? "rounded-l-sm" : index === tabs.length - 1 ? "rounded-r-sm" : ""}`}
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

