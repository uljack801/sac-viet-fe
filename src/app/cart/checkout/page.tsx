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
    const [isProcessing, setIsProcessing] = useState(false);
    const [totalPay, setTotalPay] = useState(0)
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
                                value: order.products?.reduce((sum, product) => sum + product.price * (product.quantity ? product.quantity : 1), 0) || 0,
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

    useEffect(() => {
        const total = selectedProducts?.reduce((total, group) => {
            return total + (group.products?.reduce((sum, product) => {
                return sum + (product.price - (product.price * (product.discount_percentage / 100))) * product.quantity;
            }, 0) || 0);
        }, 0)
        if (total) setTotalPay(total)
    }, [selectedProducts])

    const handleAllOrders = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            if (selectedProducts)
                for (const value of selectedProducts) {
                    const allProducts = value.products?.map(product => ({
                        productID: product._id,
                        quantity: product.quantity,
                        productName: product.name,
                        weight: product.weight
                    }));
                    if (!allProducts) continue;
                    
                    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/add-orders`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({
                            products: allProducts,
                            seller_id: value.seller?.data._id,
                            payment_method: typePay,
                            address_ship: addressShip?._id,
                            total_money_ship: shippingFees[value.seller?.data._id || ""],
                            shipping_fees: shippingFees,
                            totalPay: totalPay
                        })
                    });

                    if (res.status !== 200) {
                        throw new Error("Lỗi gửi đơn hàng cho seller: " + value.seller?.data._id);
                    }

                    if (res.status === 200) {
                        setCheckPay(true);
                        setTimeout(() => {
                            route.push(`/order?slug=1`);
                        }, 2000);

                        if (accessToken) {
                            await getCart(accessToken, setCart);
                        }
                    }
                }
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="mt-28 max-sm:mx-0 max-lg:mx-10 max-lg:mb-10 max-xl:mx-20 max-2xl:mx-36 max-2xl:mb-10 mx-96 mb-10">
            <div className="relative">
                <DeliveryAddress setUserAddress={setUserAddress} userAddress={userAddress} />
                <div className="bg-white max-sm:p-2 rounded-sm max-sm:m-1 shadow max-lg:p-4 max-xl:p-6 p-10">
                    <div className="grid grid-cols-6  max-sm:hidden max-lg:pb-4 max-lg:border-b max-xl:pb-6 max-xl:border-b pb-6 border-b">
                        <div className="col-span-3">
                            <p className="text-xl font-medium xl:text-[16px]">Sản phẩm</p>
                        </div>
                    </div>
                    {selectedProducts?.map((group) => (
                        <div key={`seller-${group.seller?.data._id}`} className={cn('border-b ')}>
                            <div className="font-semibold text-lg mb-2 grid grid-cols-6 max-sm:text-xs ">
                                <label className="flex items-center col-span-6 ">{group.seller?.data.nameShop} | <span className="flex items-center" ><BsFillChatSquareTextFill className="mr-1 ml-4" />chat ngay</span></label>
                            </div>
                            {group.products?.map((value) => (
                                <div key={`product-${value._id}`}>
                                    <div className="grid grid-cols-6 ">
                                        <div className="col-span-6">
                                            <div className="flex my-2">
                                                <Image
                                                    src={`${value.img[0]}`}
                                                    alt={`${value.name}`}
                                                    width={48}
                                                    height={48}
                                                />
                                                <div>
                                                    <p className="text-ellipsis line-clamp-1 mx-2">
                                                        {value.name}
                                                    </p>
                                                    <div className="flex justify-between mx-2">
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
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                            <p className="font-medium py-6 max-sm:text-xs text-xl">Chi phí đơn hàng</p>
                            <div className="flex justify-between m-1 ">
                                <p>
                                    Phí vận chuyển:
                                </p>
                                    <span className="ml-2 flex justify-end">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingFees[group.seller?.data._id || ""] || 0)}
                                    </span>
                            </div>
                            <div className="flex justify-between m-1 ">
                                <p>Tổng tiền hàng:</p>
                                <span className="ml-2 flex justify-end">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                    (group.products?.reduce((sum, product) => {
                                        return sum + ((product.price - (product.price * (product.discount_percentage / 100))) * product.quantity)
                                    }, 0) || 0)
                                )
                                }
                                </span>
                            </div>
                            <div className="flex justify-between m-1 ">
                                <p>
                                    Tổng đơn hàng:
                                </p>
                                    <span className="ml-2 flex justify-end">
                                        {
                                            new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                (group.products?.reduce((sum, product) => {
                                                    return (sum + ((product.price - (product.price * (product.discount_percentage / 100))) * product.quantity));
                                                }, 0) || 0) + (shippingFees[group.seller?.data._id || ""] || 0)
                                            )
                                        }
                                    </span>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end max-sm:hidden max-lg:p-0 max-xl:p-0">
                        <div className="text-end">
                            <p className="my-4">
                                Tổng tiền hàng:
                                <span className="ml-2">
                                    {
                                        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            selectedProducts?.reduce((total, group) => {
                                                return total + (group.products?.reduce((sum, product) => {
                                                    return sum + ((product.price - (product.price * (product.discount_percentage / 100))) * product.quantity);
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
                                                    return sum + (product.price - (product.price * (product.discount_percentage / 100))) * product.quantity;
                                                }, 0) || 0);
                                            }, 0) || 0)
                                        )
                                    }
                                </span>
                            </p>

                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b">
                        <p className="font-medium py-6 max-sm:text-xs">Phương thức thanh toán </p>
                        <Select defaultValue="cod" onValueChange={setTypePay}>
                            <SelectTrigger className="w-auto text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className="text-xs">
                                    <SelectItem value="cod">Thanh toán khi nhận hàng</SelectItem>
                                    <SelectItem value="bank-transfer" className="hidden">
                                        Thanh toán chuyển khoản
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full max-sm:block hidden ">
                        <div className="w-full">
                            <p className="font-medium mt-1">Chi tiết thanh toán</p>
                            <div className="grid grid-cols-2 items-center">
                                <p>
                                    Tổng tiền hàng:{" "}
                                </p>
                                <span className="ml-2 flex justify-end">
                                    {
                                        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            selectedProducts?.reduce((total, group) => {
                                                return total + (group.products?.reduce((sum, product) => {
                                                    return sum + ((product.price - (product.price * (product.discount_percentage / 100))) * product.quantity);
                                                }, 0) || 0);
                                            }, 0) || 0
                                        )
                                    }
                                </span>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <p>Tổng tiền vận chuyển:</p>
                                <span className="ml-2  flex justify-end">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((totalMoneyShip))}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <p>
                                    Tổng thanh toán:
                                </p>
                                <span className="ml-2 flex justify-end text-lg">
                                    {
                                        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            totalMoneyShip + (selectedProducts?.reduce((total, group) => {
                                                return total + (group.products?.reduce((sum, product) => {
                                                    return sum + (product.price - (product.price * (product.discount_percentage / 100))) * product.quantity;
                                                }, 0) || 0);
                                            }, 0) || 0)
                                        )
                                    }
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                <p className="text-xs px-2 mb-2">Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản Sắc Việt</p>
                <div className="flex justify-end items-center max-sm:sticky bottom-0 bg-white py-4 w-full px-2 max-lg:sticky max-lg:rounded-sm max-lg:border  max-xl:sticky max-xl:rounded-sm max-xl:border rounded-sm border sticky">
                    <Button
                        className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] text-white w-32 rounded-sm"
                        onClick={handleAllOrders}
                    >
                        Đặt hàng
                    </Button>
                </div>
                {checkPay && <div className="absolute top-0 w-full h-full flex justify-center items-center bg-neutral-100/50">
                    <Image src="/logo_.png" alt="logo" width={120} height={120} />
                </div>}
            </div>
        </div>
    )
}