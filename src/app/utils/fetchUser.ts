import { UserData } from "../components/type/user.type";
import { NEXT_PUBLIC_LOCAL } from "../helper/constant";

export const getUser = async (
  accessToken: string,
  setDataUser: React.Dispatch<React.SetStateAction<UserData | null>>
) => {
  try {
    if (accessToken) {
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      return setDataUser(data);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

