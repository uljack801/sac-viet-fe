"use client";
import { UserAddressProps } from "@/app/components/type/user.type";
import { FaLocationDot } from "react-icons/fa6";
import { AlertDialogAdd } from "./AlertDialogAdd";
import { FormUpdateAddress } from "@/app/user/[userID]/components/FormUpdateAddress";

export default function DeliveryAddress({userAddress ,setUserAddress }: {userAddress:  UserAddressProps | undefined , setUserAddress: React.Dispatch<React.SetStateAction<UserAddressProps|undefined>>}) {
  
  return (
    <div className="bg-white rounded-xl p-6 xl:px-6 xl:py-2 w-full">
      <p className="flex items-center text-xl xl:text-[16px]">
        <FaLocationDot className="mr-2" /> Địa chỉ nhận hàng
      </p>
      {userAddress?.list_address.length ? (
        userAddress?.list_address.map((value) => {
          if (!value.is_default) {
            return;
          }          
          return (
            <div key={value._id} className="mt-2 ml-2 text-sm">
              <strong>
                {value.name} {value.phone}
              </strong>
              <span className="ml-4">{value.address}</span>
              <span className="text-xs border p-0.5 text-[var(--color-text-root)] ml-2">
                {value.is_default && "Mặc định"}
              </span>
              <AlertDialogAdd
                userAddress={userAddress}
                setUserAddress={setUserAddress}
              />
            </div>
          );
        })
      ) : (
        <div className="flex items-center mt-6">
            <p className="mr-6">Thêm địa chỉ mới: </p><FormUpdateAddress /> 
        </div>
      )}
    </div>
  );
}
