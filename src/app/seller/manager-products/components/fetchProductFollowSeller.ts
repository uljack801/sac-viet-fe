import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { ProductProps } from "@/app/utils/fetchCategory";

export const fetchProductFollowSeller = async ( accessToken: string | null, sellerID: string, page: string , setListProducts: React.Dispatch<React.SetStateAction<ProductProps | undefined>>, sortProduct: string | undefined) => {
  try {
    if (accessToken) {
      const res = await fetch(
        `${NEXT_PUBLIC_LOCAL}/api/get/product-follow-seller?page=${page}&seller-id=${sellerID}&option=${sortProduct}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.status === 200) {
        const data = await res.json();
        setListProducts(data);
        return data;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
