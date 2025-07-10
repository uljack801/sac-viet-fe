import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { dataProductUpdate } from "@/app/utils/type";

export const fetchUpdateProduct = async(accessToken: string , dataProduct:dataProductUpdate) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-product`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ dataProduct: dataProduct }),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
