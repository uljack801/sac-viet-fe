import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export async function fetchConfirmForPass({confirmToken ,data ,controller } : {confirmToken: string, data: {pin: string} , controller: AbortController}) { 
       
    try {
        if(confirmToken){
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/forget-password/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization : `Bearer ${confirmToken}`
            },
            body: JSON.stringify({
                otp: data.pin
            }),
            signal: controller.signal,
        })    
           return res.status
           }
    } catch (error) {
        console.log(error);
    }
 
}