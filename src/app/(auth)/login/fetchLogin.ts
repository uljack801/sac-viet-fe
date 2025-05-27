import { RegisterSuccessResponse } from "@/app/components/type/result.type";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const fetchLogin = async ({  password, username  }: { password: string; username: string }):Promise<RegisterSuccessResponse> => {
    try {
        const res = await fetch(
            `${NEXT_PUBLIC_LOCAL}/api/post/login`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: username.trim(),
                password: password,
              }),
            }
          );
          const data = await res.json()
          return {status : res.status , data}
    } catch (error) {
        return  {
          status: 500,
          error:
            error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
}