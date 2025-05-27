"use client"

import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant"
import { useEffect } from "react"
import { useAuthSeller } from "./AuthContext"
import { useAuth } from "../AuthContext"

export default function HomeSeller() {
    const { dataUser } = useAuth()
    const sellerID = dataUser?.data.seller_id
    const { setInfoSeller , infoSeller} = useAuthSeller()
    useEffect(() => {
        const getInfoSeller  = async () => {
            try {
                const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/info-seller?seller-id=${sellerID}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await res.json();
                if(res.status === 200) setInfoSeller(data)
            } catch (error) {
                console.log(error);
            }
        }
        getInfoSeller()
    },[ sellerID ,setInfoSeller])
    console.log(infoSeller);
  return (
    <div className="">
        Trang chủ seller
    </div>
  );
}
