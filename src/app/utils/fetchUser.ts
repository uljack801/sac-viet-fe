"use client";
import { useAuth } from "@/app/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { NEXT_PUBLIC_LOCAL } from "../helper/constant";
import { getNewAccessToken } from "./getNewAccessToken";
import { UserData } from "../components/type/user.type";

export const FetchUser = () => {
  const { accessToken, setAccessToken, setCart } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);

const updateAccessToken = useCallback(async () => {
    const newToken = await getNewAccessToken();
    if (newToken) {
      setAccessToken(newToken.data.accessToken);
      setTimeout(updateAccessToken, 14 * 60 * 1000);
    }
  }, [setAccessToken]);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (accessToken === null) {
            updateAccessToken();
        }
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
          return setUser(data);
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    };
    const getCart = async () => {
      try {
        if (accessToken === null) {
            updateAccessToken();
        }
        if (accessToken) {
          const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/cart`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          });

          if (!res.ok) throw new Error("Unauthorized");
          const data = await res.json();          
          return setCart(data.data.flat());
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    };
    getUser();
    getCart();
  }, [accessToken, updateAccessToken, setCart ]);
  return user;
};
