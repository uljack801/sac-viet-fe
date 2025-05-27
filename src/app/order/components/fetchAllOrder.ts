import { OrderProps } from "@/app/config/models/Order";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const getOrder = async ({
  accessToken,
  setDataOrder,
}: {
  accessToken: string | null;
  setDataOrder: React.Dispatch<React.SetStateAction<OrderProps | undefined>>;
}) => {
  try {
    if (accessToken) {
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/order`, {
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
