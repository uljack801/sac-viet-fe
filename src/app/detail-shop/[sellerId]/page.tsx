"use client";

import { useAuth } from "@/app/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { InfoSellerProps } from "@/app/checkout/components/ProductChoisePay";
export default function DetailShop() {
  const param = useParams();
  const sellerID = param.sellerId;
  const { listProducts } = useAuth();
  const [dataSeller, setDataSeller] = useState<InfoSellerProps | null>();

  const otherProduct = listProducts?.data
    .filter((value) => value.seller_id === sellerID)
    .slice(0, 20);
  const route = useRouter();

  const getInfoSeller = useCallback(async (paramSellerId: string) => {
    try {
      const res = await fetch(
        `${NEXT_PUBLIC_LOCAL}/api/get/info-seller?seller-id=${paramSellerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data: InfoSellerProps = await res.json();
      if (res.status === 200) return data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (!sellerID) return;
      const data = await getInfoSeller(String(sellerID));
      setDataSeller(data);
    };
    getData();
  }, [getInfoSeller, sellerID]);
  console.log(dataSeller);
  
  return (
    <div className=" pt-28 max-xl:mx-0 max-[1540px]:mx-36 mx-96 ">
      <div className="my-6 bg-white border rounded-sm p-6">
        <p className="text-4xl font-medium">Cửa hàng: {dataSeller?.data.nameShop}</p>
      </div>
      <div className="grid grid-cols-6 gap-2 mb-20">
        {otherProduct?.map((value) => (
          <div
            key={value._id}
            onClick={() => route.push(`/product-details/${value._id}`)}
            className="relative col-span-1 p-1 rounded-sm shadow bg-white cursor-pointer hover:scale-[1.03] max-h-60"
          >
            <div className="relative p-1 h-full max-h-60">
              <div className="h-2/3 ">
                <Image
                  src={`${value.img[0]}`}
                  alt={value.name}
                  width={240}
                  height={240}
                  className="object-cover w-full h-full rounded-xs"
                />
              </div>
              <div className="h-1/3 flex flex-col justify-between">
                <p className="line-clamp-2 text-[var(--color-text-root)] max-sm:text-xs text-sm">
                  {value.name}
                </p>
                <div className="flex justify-between items-center mx-1">
                  <p className="text-[var(--color-text-root)] font-medium flex justify-center items-center 2xl:text-lg lg:text-sm">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value.price)}
                  </p>
                  <p className="text-sm max-sm:text-xs text-[var(--color-text-root)]">
                    đã bán {value.sold}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
