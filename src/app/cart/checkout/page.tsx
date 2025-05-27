"use client"

import DeliveryAddress from "@/app/checkout/components/DeliveryAddress";
import { GroupedProductsProps } from "../page";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAddressProps } from "@/app/components/type/user.type";
import { fetchAddress } from "@/app/checkout/components/fetchAddress";
import { useAuth } from "@/app/AuthContext";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { useRouter } from "next/navigation";
import { getCart } from "@/app/utils/fetchCart";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function Checkout() {
    const { accessToken, setCart } = useAuth()
    const [selectedProducts, setSelectedProducts] = useState<GroupedProductsProps>()
    const [typePay, setTypePay] = useState("cod");
    const [totalMoneyShip, setTotalMoneyShip] = useState(0)
    const [userAddress, setUserAddress] = useState<UserAddressProps | undefined>();
    const [checkPay, setCheckPay] = useState(false)
    const route = useRouter();
    const addressShip = userAddress?.list_address.find(value => value.is_default === true);
    const [shippingFees, setShippingFees] = useState<{ [sellerId: string]: number }>({});

    useEffect(() => {
        const data = localStorage.getItem("selectedProducts");
        if (data) {
            setSelectedProducts(JSON.parse(data))
        }
    }, [])
    useEffect(() => {
        fetchAddress({ accessToken, setUserAddress })
    }, [accessToken])

    useEffect(() => {
        const getShippingFee = async () => {
            if (!selectedProducts || !addressShip) return;

            try {
                const feeMap: { [sellerId: string]: number } = {};

                await Promise.all(
                    selectedProducts.map(async (order) => {
                        const sellerId = order.seller?.data._id;
                        if (!sellerId) return;
                        const res = await axios.get('/api/ghtk/shipping-fee', {
                            params: {
                                pick_province: order.seller?.data.address.split(',')[3],
                                pick_district: order.seller?.data.address.split(',')[2],
                                province: addressShip.address.split(",")[3],
                                district: addressShip.address.split(",")[2],
                                weight: order.products?.reduce((sum, product) => sum + product.weight, 0) || 0,
                                value: order.products?.reduce((sum, product) => sum + product.price * product.quantity, 0) || 0,
                            },
                        });
                        const fee = res.data.fee.fee + res.data.fee.insurance_fee;
                        feeMap[sellerId] = fee;
                    })
                );
                setShippingFees(feeMap);
                const total = Object.values(feeMap).reduce((sum, fee) => sum + fee, 0);
                setTotalMoneyShip(total);
            } catch (error) {
                console.error("Lỗi tính phí vận chuyển:", error);
            }
        };
        getShippingFee();
    }, [selectedProducts, addressShip]);


    const handlePay = async () => {
        try {
            const allProducts = selectedProducts?.flatMap(value =>
                value.products?.map(product => ({
                    productID: product._id,
                    quantity: product.quantity
                }))
            ) || [];

            const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/add-orders`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    products: allProducts,
                    payment_method: typePay,
                    address_ship: addressShip?._id,
                    total_money_ship: totalMoneyShip,
                    shipping_fees: shippingFees
                })
            });

            if (res.status === 200) {
                setCheckPay(true);
                setTimeout(() => {
                    route.push(`/order?slug=1`);
                }, 2000);
                if (accessToken) {
                    const dataCart = await getCart(accessToken)
                    setCart(dataCart);
                }
            }
        } catch (error) {
            console.error("Payment error:", error);
        }
    };
    return (
        <div className="mt-32 2xl:mx-80 xl:mx-40">
            <div className="relative">
                <DeliveryAddress setUserAddress={setUserAddress} userAddress={userAddress} />
                <div className="bg-white p-6 rounded-xl mt-4 mb-4 xl:text-sm">
                    <div className="grid grid-cols-6">
                        <div className="col-span-3">
                            <p className="text-xl font-medium xl:text-[16px]">Sản phẩm</p>
                        </div>
                        <div className="col-span-1">
                            <p>Đơn giá</p>
                        </div>
                        <div className="col-span-1">
                            <p>Số lượng</p>
                        </div>
                        <div className="col-span-1">
                            <p>Thành tiền</p>
                        </div>
                    </div>
                    {selectedProducts?.map((group) => (
                        <div key={`seller-${group.seller?.data._id}`} className={cn('my-6 ' )}>
                            <div className="font-semibold text-lg mb-2 grid grid-cols-6 ">
                                <label className="flex items-center col-span-6 xl:text-sm">{group.seller?.data.nameShop} | <span className="flex items-center text-sm xl:text-xs" ><BsFillChatSquareTextFill className="mr-1 ml-4" />chat ngay</span></label>
                            </div>
                            {group.products?.map((value ) => (
                                <div key={`product-${value._id}`}>
                                    <div className="grid grid-cols-6 ">
                                        <div className="col-span-3">
                                            <div className="flex my-2">
                                                <Image src={`/do-tho/${value.img[0]}`} alt={`${value.name}`} width={48} height={48} />
                                                <div>
                                                    <p className="text-ellipsis line-clamp-1 mx-2">{value.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className=" mt-2">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price - (value.price * (value.discount_percentage / 100))))}</div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex items-center mt-2 text-xl w-auto ">
                                                <span className="flex justify-center items-center w-6 text-sm"> {value.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="mt-2">
                                                <p className="">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.quantity * (value.price - (value.price * (value.discount_percentage / 100)))))}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end pr-16 mt-2 my-2 ">
                                <p>
                                    Phí vận chuyển:
                                    <span className="ml-2">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingFees[group.seller?.data._id || ""] || 0)}
                                    </span>
                                </p>
                            </div>
                            <div className="flex justify-end pr-16">
                                <p>Tổng số tiền<span className="ml-2">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                    (group.products?.reduce((sum, product) => {
                                        return sum + (product.price - (product.price * (product .discount_percentage / 100))) * product.quantity
                                    }, 0) || 0)
                                )
                                }
                                </span></p>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between items-center pr-16 border-y">
                        <p className="text-xl font-medium py-6 xl:text-[16px]">Phương thức thanh toán </p>
                        <Select defaultValue="cod" onValueChange={setTypePay}>
                            <SelectTrigger className="w-auto">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectGroup>
                                    <SelectItem value="cod" >Thanh toán khi nhận hàng</SelectItem>
                                    <SelectItem value="bank-transfer">Thanh toán chuyển khoản</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end pr-16">
                        <div>
                            <p className="my-4">
                                Tổng tiền hàng:
                                <span className="ml-2">
                                    {
                                        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            selectedProducts?.reduce((total, group) => {
                                                return total + (group.products?.reduce((sum, product) => {
                                                    return sum + (product.price - (product.price * (product .discount_percentage / 100))) * product.quantity;
                                                }, 0) || 0);
                                            }, 0) || 0
                                        )
                                    }
                                </span>
                            </p>
                            <p className="mb-4">Tổng tiền vận chuyển: <span className="ml-2">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((totalMoneyShip))}</span></p>
                            <p className="my-4">
                                Tổng thanh toán:
                                <span className="ml-2 text-xl">
                                    {
                                        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            totalMoneyShip + (selectedProducts?.reduce((total, group) => {
                                                return total + (group.products?.reduce((sum, product) => {
                                                    return sum + (product.price - (product.price * (product .discount_percentage / 100))) * product.quantity;
                                                }, 0) || 0);
                                            }, 0) || 0)
                                        )
                                    }
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center border-t sticky bottom-0 p-6 pr-16 mb-10 bg-white rounded-sm">
                    <p className="text-xs">Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản Sắc Việt</p>
                    <Button className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] text-white w-32 rounded-sm" onClick={handlePay}>Đặt hàng</Button>
                </div>
                {checkPay && <div className="absolute top-0 w-full h-full flex justify-center items-center bg-neutral-100/50">
                    <Image src="/logo_.png" alt="logo" width={120} height={120} />
                </div>}
            </div>
        </div>        
    )
}