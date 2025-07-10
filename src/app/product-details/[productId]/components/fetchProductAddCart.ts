import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchProductAddCart = async (accessToken: string , productId: string| undefined , quantityChoise: number) => {
    try {
         const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/product-add-card`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                  productId: productId,
                  quantityChoise: quantityChoise
                })
              })
              return res
    } catch (error) {
        console.log(error);
        
    }
}