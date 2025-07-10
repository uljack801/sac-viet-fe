import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchChangeStatusOrder =async (accessToken: string , id: string) => {
  try {
    const res = await fetch(
      `${NEXT_PUBLIC_LOCAL}/api/patch/change-status-order?order-id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};
