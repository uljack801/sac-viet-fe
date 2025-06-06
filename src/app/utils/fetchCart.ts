import { NEXT_PUBLIC_LOCAL } from "../helper/constant";
import { ProductListProps } from "./fetchCategory";

export const getCart = async (
  accessToken: string,
  setCart: React.Dispatch<React.SetStateAction<ProductListProps[] | null>>
) => {
  try {
    if (accessToken) {
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      return setCart(data.data.flat());
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
