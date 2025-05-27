import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchDeleteUser = async (confirmAccess: string) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/delete/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${confirmAccess}`
      },
    });
    return res.status;
  } catch (error) {
    console.log("DELETE USER ERROR", error);
  }
};
