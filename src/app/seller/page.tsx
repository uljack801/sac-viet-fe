"use client"

import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant"
import { useEffect } from "react"
import { useAuthSeller } from "./AuthContext"
import { useAuth } from "../AuthContext"

export default function HomeSeller() {
    const { accessToken } = useAuth();
    const { setInfoSeller , infoSeller} = useAuthSeller()
    useEffect(() => {
        const getInfoSeller  = async () => {
            try {
                if(accessToken){
                const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/info-page-seller`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization : `Bearer ${accessToken}`
                    }
                })
                const data = await res.json();
                if(res.status === 200) setInfoSeller(data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getInfoSeller()
    },[accessToken  ,setInfoSeller])
    console.log(infoSeller);
  return (
    <div className="">
        Trang chủ seller
    </div>
  );
}
