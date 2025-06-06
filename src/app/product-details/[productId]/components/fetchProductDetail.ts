import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant"
import { ProductProps } from "@/app/utils/fetchCategory";

export const fetchProductDetail = async (productId: string) => {
    try {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/product-detail?productId=${productId}`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            },
        })
        if(res.status !== 200){
            return console.log("Không tìm thấy sản phẩm");
        }
        const data:ProductProps = await res.json();
        return data
    } catch (error) {
        console.log(error);
        
    }
}