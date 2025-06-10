"use client";
import { useAuth } from "@/app/AuthContext";
import { UserAddressProps } from "@/app/components/type/user.type";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function SelectFormAddress() {
  const { accessToken, dataUser } = useAuth();
  const [userAddress, setUserAddress] = useState<UserAddressProps | undefined>();
  const [isWait, setIsWait] = useState(false);

  useEffect(() => {
    const getAddress = async () => {
      if (accessToken) {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/user-address`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json()
        setUserAddress(data.data)
      }
    }
    getAddress()
  }, [accessToken, dataUser, setUserAddress])


  const handleDeleteAddress = async (idx: number) => {
    try {
      if (isWait) return
      setIsWait(true)
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/delete-address`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          idx: idx,
        }),
      });
      if (res.status === 200) {
        const data = await res.json();
        setUserAddress(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsWait(false)
    }

  };
  return (
    <div>
      {userAddress?.list_address?.map((value, idx) => {
        return (
          <div key={idx} className="flex items-center my-2 border-b">
              <p className="max-sm:text-xs max-xl:text-xl">
                Địa chỉ {idx + 1}: {value.address} - {value.phone} - {value.name}
              </p>
            <div className="h ml-1">
              <Button
                className=" hover:bg-inherit bg-inherit shadow-none text-black/50"
                title="xóa địa chỉ"
                onClick={() => handleDeleteAddress(idx)}
              >
                x
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
