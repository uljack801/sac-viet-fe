"use client";
import { useAuth } from "@/app/AuthContext";
import { UserAddressProps } from "@/app/components/type/user.type";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";

export function SelectFormAddress() {
  const { accessToken, dataUser } = useAuth();
  const [ userAddress, setUserAddress ] = useState<UserAddressProps | undefined>();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const getAddress = async () => {
    if(accessToken){
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
  },[accessToken, dataUser, setUserAddress])

  
  const handleDeleteAddress = async (idx: number) => {
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
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };
  return (
    <div>
      {userAddress?.list_address?.map((value, idx)  => {
        return (
          <div key={idx} className="flex items-center">
            <div>
            <p className="my-2 border py-2 px-2 rounded-sm">
              Địa chỉ {idx + 1}: {value.address} - {value.phone} - {value.name}
            </p>
            </div>
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
      {showAlert && 
       <Alert className="absolute top-1/5 right-0 w-auto px-10 mr-1 bg-red-200/30 text-red-400/65 border-0">
       <Terminal />
       <AlertTitle>Xóa địa chỉ thành công!</AlertTitle>
     </Alert>
      }
    </div>
  );
}
