import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchChangePassword =async ({newPassword, confirmToken}: {newPassword: string, confirmToken: string}) => {
    try {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/change-password`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${confirmToken}`
              },
              body: JSON.stringify({
                password: newPassword,
              }),
            });
            return res.status
    } catch (error) {
        console.log(error);
        
    }
}