import { InfoSellerProps } from "@/app/checkout/components/ProductChoisePay";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

   export const getInfoSeller = async (accessToken: string,  setInfoSeller: React.Dispatch<React.SetStateAction<InfoSellerProps | null>>) => {
        try {
            if (accessToken) {
                const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/info-page-seller`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                const data = await res.json();
                if (res.status === 200) setInfoSeller(data)
            }
        } catch (error) {
            console.log(error);
        }
    }
