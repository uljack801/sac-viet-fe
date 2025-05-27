import {  RegisterSuccessResponse } from "@/app/components/type/result.type";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchConfirmEmail = async ({
  inputOtp,
  confirmAccess,
  controller,
}: {
  inputOtp: string;
  confirmAccess: string;
  controller: AbortController;
}): Promise<RegisterSuccessResponse> => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/confirm-email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${confirmAccess}`,
      },
      body: JSON.stringify({
        otp: inputOtp,
      }),
      signal: controller.signal,
    });
    const data = await res.json();
    const status = res.status;
    return { status, data };
  } catch (error) {
    return {
      status: 500,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
