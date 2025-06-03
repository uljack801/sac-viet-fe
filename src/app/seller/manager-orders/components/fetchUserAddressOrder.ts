import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchUserAddressOrder = async (accessToken: string, userID: string,  addressID:string) => {
  try {
    if (accessToken) {
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/find-user-address?user-id=${userID}&address-id=${addressID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      return data.data
    }
  } catch (error) {
    console.log(error);
  }
};
