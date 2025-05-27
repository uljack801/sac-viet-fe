import { NEXT_PUBLIC_LOCAL } from "../helper/constant";

export const getCart = async (accessToken: string) => {
    try{
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/cart`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        return data.data.flat()
      
    } catch (error) {
      console.log(error);
      return null;
    }
  };