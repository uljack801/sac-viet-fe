import { RegisterResponse } from "@/app/components/type/result.type";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";



export const fetchPostRegister = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: username,
        email: email,
        password: password,
      }),
    });

    if (!res.ok) {
      return {
        status: res.status,
        error: `HTTP error! Status: ${res.status}`,
      };
    }

    const data = await res.json();
    return { data, status: res.status };
  } catch (error) {
    return {
      status: 500,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
