import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchChangePassword = async (data: {password: string, newPassword: string}, accessToken: string) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        password: data.password,
        newPassword: data.newPassword,
      }),
    });
    return res
  } catch (error) {
    console.log(error);
  }
};
