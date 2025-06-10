"use client";
import { UserAddressProps } from "@/app/components/type/user.type";
import { FaLocationDot } from "react-icons/fa6";
import { AlertDialogAdd } from "./AlertDialogAdd";
import { FormUpdateAddress } from "@/app/user/[userID]/components/FormUpdateAddress";

export default function DeliveryAddress({ userAddress, setUserAddress }: { userAddress: UserAddressProps | undefined, setUserAddress: React.Dispatch<React.SetStateAction<UserAddressProps | undefined>> }) {

  return (
    <div className="bg-white rounded-sm max-sm:p-1 max-sm:m-1 max-sm:w-auto shadow max-lg:p-4 max-lg:w-full max-lg:m-0 max-lg:mb-4 max-xl:p-6 max-xl:m-0 max-xl:mb-6 p-6 mb-6">
      {userAddress?.list_address.length ? (
        userAddress?.list_address.map((value) => {
          if (!value.is_default) {
            return;
          }
          return (
            <div key={value._id} className=" max-sm:text-xs flex items-center max-lg:text-sm max-xl:text-xl">
              <div>
              <strong className="flex items-center">
                <FaLocationDot className="mr-2" />{value.name}, {value.phone}
              </strong>
              <div className="mx-4">
                <span >{value.address}</span>
                <span className="max-sm:text-[10px] border p-0.5 text-[var(--color-text-root)] ml-2">
                  {value.is_default && "Mặc định"}
                </span>
              </div>
              </div>
              <AlertDialogAdd
                userAddress={userAddress} 
                setUserAddress={setUserAddress}
              />
            </div>
          );
        })
      ) : (
        <div className="flex items-center max-sm:grid max-sm:grid-cols-3">
          <p className="mr-1 max-sm:text-sm max-lg:text-sm max-xl:text-xl">Thêm địa chỉ mới: </p>
          <FormUpdateAddress />
        </div>
      )}
    </div>
  );
}
