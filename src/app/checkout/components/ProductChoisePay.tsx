"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { ProductProps } from "@/app/utils/fetchCategory";

export type InfoSellerProps = {
  data: {
    _id: string;
    user: string;
    nameShop: string;
    email: string;
    phoneNumber: string;
    address: string;
    typeBusiness: string;
    nameCompany: string;
    addressRegisterBusiness: string;
    emailToReceive: string;
    businessRegistrationCertificate: {
      taxNumber: string;
      fileUrl: string;
      isVerified: boolean;
    };
    logoShop: string;
    descriptionShop: string;
    isVerified: boolean;
    socialLinks: {
      facebook: string;
      zalo: string;
      instagram: string;
    };
    rating: number;
    totalOrders: number;
    totalProducts: number;
  };
};
export default function ProductChoisePay({
  setQuantityChoise,
  quantityChoise,
  product,
  infoSeller,
  totalMoneyShip,
  setTypePay,
  handlePay,
  setTotalPay,
}: {
  setQuantityChoise: React.Dispatch<React.SetStateAction<number>>;
  setTypePay: React.Dispatch<React.SetStateAction<string>>;
  quantityChoise: number;
  product: ProductProps | undefined;
  infoSeller: InfoSellerProps | undefined;
  totalMoneyShip: number;
  setTotalPay: React.Dispatch<React.SetStateAction<number>>;
  handlePay: () => void;
}) {
  const [priceAfterDiscount, setPriceAfterDiscount] = useState<number>(0)
  const handleChoiseUp = () => {
    const inventory = product?.data[0].inventory;
    if (inventory) {
      if (quantityChoise < inventory) {
        setQuantityChoise(quantityChoise + 1);
      }
    }
  };
  const handleChoisedown = () => {
    if (quantityChoise > 1) {
      setQuantityChoise(quantityChoise - 1);
    }
  };
  useEffect(() => {
    if (product) {
      const priceAfterDiscount = product.data[0].price - (product.data[0].price * (product.data[0].discount_percentage / 100))
      setPriceAfterDiscount(priceAfterDiscount)
    }
  }, [product])

  useEffect(() => {
    setTotalPay(quantityChoise * priceAfterDiscount)
  }, [priceAfterDiscount, quantityChoise, setTotalPay])
  return (
    product &&
    infoSeller && (
      <div>
        <div className="bg-white rounded-sm mb-4 shadow max-sm:m-1 max-sm:p-2  max-sm:text-xs max-lg:p-4 max-lg:text-lg max-xl:p-10 max-xl:text-xl p-10">
          <div className="grid grid-cols-6 max-sm:hidden max-lg:pb-4 max-lg:border-b  max-xl:pb-4 max-xl:border-b pb-4 border-b">
            <div className="col-span-3">
              <p className="font-medium">Sản phẩm</p>
            </div>
          </div>
          <div className="grid grid-cols-6">
            <div className="col-span-6">
              <p className="flex items-center">
                {infoSeller.data.nameShop} |{" "}
                <span className="flex max-sm:text-xs justify-center items-center">
                  <BsFillChatSquareTextFill className="mr-1 ml-4" />
                  chat ngay
                </span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 border-b">
            <div className="col-span-2">
              <div className="flex my-2">
                <Image
                  src={`${product.data[0].img[0]}`}
                  alt={`${product.data[0].name}`}
                  width={48}
                  height={48}
                />
                <div>
                  <p className="text-ellipsis line-clamp-1 mx-2">
                    {product.data[0].name}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-2 items-center mb-4">
              <div className="col-span-1">
                <p>Số lượng</p>
              </div>
              <div className="col-span-1 flex justify-end">
                <div className="flex items-center mt-2 text-xl w-auto ">
                  <Button
                    onClick={() => handleChoisedown()}
                    className="border mr-2 bg-white text-black hover:bg-white"
                  >
                    <IoRemoveOutline />
                  </Button>
                  <span className="flex justify-center items-center w-6 text-sm">
                    {quantityChoise}
                  </span>
                  <Button
                    onClick={() => handleChoiseUp()}
                    className="border ml-2 bg-white text-black hover:bg-white"
                  >
                    <IoAddOutline />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center border-b py-4">
            <p className="font-medium max-sm:text-xs">
              Tổng tiền ({quantityChoise} sản phẩm):
            </p>
            <p className="text-red-500 ml-2 text-xl">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(quantityChoise * priceAfterDiscount)}
            </p>
          </div>
          <div className="flex justify-between items-center border-b">
            <p className="font-medium py-6 max-sm:text-xs max-lg:text-lg">Phương thức thanh toán </p>
            <Select defaultValue="cod" onValueChange={setTypePay}>
              <SelectTrigger className="w-auto text-xs max-lg:text-lg max-xl:text-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup >
                  <SelectItem value="cod">Thanh toán khi nhận hàng</SelectItem>
                  <SelectItem value="bank-transfer" className="hidden">
                    Thanh toán chuyển khoản
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full">
            <div className="w-full">
              <p className="font-medium mt-1">Chi tiết thanh toán</p>
              <div className="grid grid-cols-2 items-center">
                <p className="my-4">
                  Tổng tiền hàng:{" "}
                </p>
                <span className="flex justify-end">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(quantityChoise * priceAfterDiscount)}
                </span>
              </div>
              <div className="grid grid-cols-2 items-center mb-4">
                <p>
                  Tổng tiền vận chuyển:
                </p>
                <span className="flex justify-end">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalMoneyShip)}
                </span>
              </div>
              <div className="grid grid-cols-2 items-center">
                <p>
                  Tổng thanh toán:
                </p>
                <span className="text-xl text-red-500 flex justify-end">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    quantityChoise * priceAfterDiscount + totalMoneyShip
                  )}
                </span>
              </div>

            </div>
          </div>
        </div>
        <p className="text-xs px-2 mb-2">
          Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo
          Điều khoản Sắc Việt
        </p>
        <div className="flex justify-end items-center max-sm:fixed bottom-0 bg-white py-4 w-full  max-lg:p-4 max-lg:border max-lg:rounded-sm max-xl:p-4 max-xl:border max-xl:rounded-sm p-4 border rounded-sm">
          <Button
            className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] text-white w-32 rounded-sm"
            onClick={handlePay}
          >
            Đặt hàng
          </Button>
        </div>
      </div>
    )
  );
}
