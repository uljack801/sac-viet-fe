import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { Dayjs } from "dayjs";

export const fetchUpdateInfoUser = async (
  data: {
    fullname: string;
    phoneNumber: string;
    gender: string;
    account: string;
    email: string;
  },
  valueDob: Dayjs | null,
  accessToken: string
) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-info-user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fullname: data.fullname,
        phoneNumber: data.phoneNumber,
        dateOfBirth: valueDob,
        gender: data.gender,
      }),
    });
    return res
  } catch (error) {
    console.log(error);
  }
};
