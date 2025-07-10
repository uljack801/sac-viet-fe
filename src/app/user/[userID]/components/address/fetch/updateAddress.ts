import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const updateAddress = async(accessToken: string , data: {detail: string , phone: string , name: string} , valueCommune: string) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-address`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        address: data.detail + ", " + valueCommune,
        commune: valueCommune.split(",")[0],
        district: valueCommune.split(",")[1],
        capital: valueCommune.split(",")[2],
        deatails: data.detail,
        phone: data.phone,
        name: data.name,
      }),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
