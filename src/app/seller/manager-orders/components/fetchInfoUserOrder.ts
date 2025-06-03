import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchUserOrder = async (accessToken: string, userID: string) => {
  try {
    if (accessToken) {
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/find-user?user-id=${userID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
