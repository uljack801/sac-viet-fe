import { useAuth } from "@/app/AuthContext";
import { UserAddressProps } from "@/app/components/type/user.type";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
export function AlertDialogAdd({
  userAddress,
  setUserAddress
}: {
  userAddress: UserAddressProps | undefined;
  setUserAddress: React.Dispatch<React.SetStateAction<UserAddressProps | undefined>>;
}) {
  const { accessToken } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    userAddress?.list_address.find((value) => value.is_default)?._id
  );

  const handleChangeAddress = async (selectedAddress: string | undefined) => {
    try {
      if(selectedAddress){
       const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/change-address`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          idAddress: selectedAddress,
        }),
      });
      const data = await res.json();
      if( res.status === 200){
        setUserAddress(data.data)
      }
    }
    } catch (error) {
      console.log(error);
    }
  
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="text-[var(--color-text-root)] hover:text-[var(--color-text-root)] ml-4 cursor-pointer text-xs py-2"
        >
          Thay đổi
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-[var(--color-text-root)]">
        <AlertDialogHeader>
          <AlertDialogTitle>Thay đổi địa chỉ nhận hàng?</AlertDialogTitle>
          <RadioGroup
            value={selectedAddress}
            onValueChange={setSelectedAddress}
          >
            {userAddress?.list_address.map((value) => {
              return (
                <span key={value._id} className="flex items-center space-x-2">
                  <RadioGroupItem value={value._id} id={value._id} />
                  <Label htmlFor={value._id}>
                    {value.name}-{value.phone}-{value.address}
                  </Label>
                </span>
              );
            })}
          </RadioGroup>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]"
            onClick={() => handleChangeAddress(selectedAddress)}
          >
            Lưu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
