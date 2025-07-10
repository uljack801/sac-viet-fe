import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchGetAddress =async (accessToken: string) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/user-address`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res
  } catch (error) {
    console.log(error);
  }
};
