import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchResendOTP = async (confirmAccess: string) => {  
  try {
    await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/confirm-email`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${confirmAccess}`
      },
    });
  } catch (error) {
    console.log(error);
  }
};
