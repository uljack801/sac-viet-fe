import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchRegisterSeller = async (
  accessToken: string,
  valueAddressBusiness: string | undefined,
  valueAddress: string | undefined ,
  data: {
    nameShop: string;
    email: string;
    phone: string;
    emailToReceive: string;
    taxNumber: string,
    nameCompany?: string | undefined,
    type: "individual" | "business" | "company"
  }
) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/register-seller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        nameShop: data.nameShop,
        email: data.email,
        phoneNumber: data.phone,
        emailToReceive: data.emailToReceive,
        taxNumber: data.taxNumber,
        nameCompany: data.nameCompany,
        typeBusiness: data.type,
        address: valueAddress,
        addressRegisterBusiness: valueAddressBusiness,
      }),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
