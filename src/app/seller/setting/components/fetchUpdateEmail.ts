import { InfoSellerProps } from "@/app/checkout/components/ProductChoisePay";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchUpdateEmail = async (accessToken: string, email: string, sellerID: string , setInfoSeller: React.Dispatch<React.SetStateAction<InfoSellerProps | null>>
) => {    
  try {
    const res = await fetch(
      `${NEXT_PUBLIC_LOCAL}/api/patch/update-email-seller`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email: email, sellerID }),
      }
    );
    if(res.status === 200){
        const data = await res.json()        
        return setInfoSeller(data)
    }
  } catch (error) {
    console.log(error);
  }
};
