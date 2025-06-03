import { OrderProps } from "@/app/config/models/Order";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const getAllOrder = async ({
  accessToken,
  sellerID,
 setDataOrder,
}: {
  accessToken: string | null;
  sellerID: string | null;
  setDataOrder: React.Dispatch<React.SetStateAction<OrderProps[] | undefined>>;
}) => {
  try {
    if (accessToken) {
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/all-order?seller-id=${sellerID}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      return setDataOrder(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};
