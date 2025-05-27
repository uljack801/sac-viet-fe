import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export async function fetchForgetPassword({email  } : {email: string}) {
    try {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/forget-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
           })    
           const accessToken = await res.json();
           return {status: res.status, accessToken}
    } catch (error) {
        console.log(error);
        
    }
 
}