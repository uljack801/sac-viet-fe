"use client";
import { ProductProps } from "@/app/utils/fetchProduct";
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
  const [priceAfterDiscount , setPriceAfterDiscount] = useState<number>(0)
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
    setTotalPay(quantityChoise * priceAfterDiscount )
  }, [priceAfterDiscount, quantityChoise, setTotalPay])
  return (
    product &&
    infoSeller && (
      <div className="bg-white p-6 rounded-xl mt-2 mb-10 xl:text-sm ">
        <div className="grid grid-cols-6">
          <div className="col-span-3">
            <p className="text-xl font-medium xl:text-[16px]">Sản phẩm</p>
          </div>
          <div className="col-span-1 ">
            <p>Đơn giá</p>
          </div>
          <div className="col-span-1">
            <p>Số lượng</p>
          </div>
          <div className="col-span-1">
            <p>Thành tiền</p>
          </div>
        </div>
        <div className="grid grid-cols-6 my-6">
          <div className="col-span-6">
            <p className="flex items-center">
              {infoSeller.data.nameShop} |{" "}
              <span className="flex text-xs justify-center items-center">
                <BsFillChatSquareTextFill className="mr-1 ml-4" />
                chat ngay
              </span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-6 border-b">
          <div className="col-span-3">
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
          <div className="col-span-1">
            <div className=" mt-2">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(priceAfterDiscount)}
            </div>
          </div>
          <div className="col-span-1">
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
          <div className="col-span-1">
            <div className="mt-2">
              <p className="flex justify-end pr-16">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(quantityChoise * priceAfterDiscount)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center pr-16  py-6 border-b">
          <p className="text-xl font-medium xl:text-[16px]">
            Tổng tiền ({quantityChoise} sản phẩm):
          </p>
          <p className="text-red-500 ml-2 text-xl">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(quantityChoise * priceAfterDiscount)}
          </p>
        </div>
        <div className="flex justify-between items-center pr-16 border-b">
          <p className="text-xl font-medium py-6 xl:text-[16px]">Phương thức thanh toán </p>
          <Select defaultValue="cod" onValueChange={setTypePay}>
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="cod">Thanh toán khi nhận hàng</SelectItem>
                <SelectItem value="bank-transfer" className="hidden">
                  Thanh toán chuyển khoản
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end pr-16">
          <div>
            <p className="my-4">
              Tổng tiền hàng:{" "}
              <span className="ml-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(quantityChoise * priceAfterDiscount)}
              </span>
            </p>
            <p className="mb-4">
              Tổng tiền vận chuyển:
              <span className="ml-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalMoneyShip)}
              </span>
            </p>
            <p>
              Tổng thanh toán:
              <span className="text-2xl text-red-500 ml-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  quantityChoise * priceAfterDiscount + totalMoneyShip
                )}
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center border-t py-6 pr-16 mt-10">
          <p className="text-xs">
            Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo
            Điều khoản Sắc Việt
          </p>
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
