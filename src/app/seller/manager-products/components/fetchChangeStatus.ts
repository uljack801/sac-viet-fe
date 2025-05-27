import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";


export const fetchChangeStatus = async (productID: string , sellerID: string, accessToken:string) => {
    try {
        let status 
        if(accessToken){
           const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/change-status-product`, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    sellerID: sellerID,
                    productID: productID
                })
            })
            if(res.status === 200){
                status = res.status
            }
        }
        return status
    } catch (error) {
        console.log(error);
        
    }    
}