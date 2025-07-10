import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const deleteAddress = async(accessToken: string , idx:number) => {
    try {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/delete-address`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          idx: idx,
        }),
      });
      return res
    } catch (error) {
        console.log(error);
        
    }
}