import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";

export const FetchPostContact = async ({
  username,
  accountEmail,
  phone,
  message,
}: {
  username: string;
  accountEmail: string;
  phone: string;
  message: string;
}) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email: accountEmail,
        phone: phone,
        message: message,
      }),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
