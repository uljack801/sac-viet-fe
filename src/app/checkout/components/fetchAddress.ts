import { UserAddressProps } from "@/app/components/type/user.type";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchAddress = async ({
  accessToken,
  setUserAddress,
}: {
  setUserAddress: React.Dispatch<
    React.SetStateAction<UserAddressProps | undefined>
  >;
  accessToken: string | null;
}) => {
  try {
    if (accessToken) {
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/user-address`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setUserAddress(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};
