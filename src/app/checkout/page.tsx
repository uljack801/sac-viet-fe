"use client";
import { useCallback, useEffect, useState } from "react";
import DeliveryAddress from "./components/DeliveryAddress";
import ProductChoisePay, {
    InfoSellerProps,
} from "./components/ProductChoisePay";
import { useAuth } from "../AuthContext";
import { UserAddressProps } from "../components/type/user.type";
import { NEXT_PUBLIC_LOCAL } from "../helper/constant";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductProps } from "../utils/fetchCategory";
import { fetchProductDetail } from "../product-details/[productId]/components/fetchProductDetail";
import Image from "next/image"
import { fetchAddress } from "./components/fetchAddress";
import axios from "axios";

export default function Checkout() {
    const { accessToken, dataUser } = useAuth();
    const [userAddress, setUserAddress] = useState<UserAddressProps | undefined>();
    const [product, setProduct] = useState<ProductProps | undefined>();
    const [infoSeller, setInfoSeller] = useState<InfoSellerProps | undefined>();
    const [totalMoneyShip, setTotalMoneyShip] = useState(0);
    const [typePay, setTypePay] = useState("cod");
    const param = useSearchParams();
    const productId = param.get("product-id");
    const quantity = param.get("quantity-product");
    const [quantityChoise, setQuantityChoise] = useState(Number(quantity));
    const addressShip = userAddress?.list_address.find(value => value.is_default === true);
    const [checkPay, setCheckPay] = useState(false)
    const route = useRouter();
    const [shippingFees, setShippingFees] = useState<{ [sellerId: string]: number }>({});
    const [ totalPay , setTotalPay ] = useState<number>(0)
    const [checkAddress , setCheckAddress ] = useState(false)
   useEffect(() => {
        fetchAddress({ accessToken, setUserAddress })
}, [accessToken, dataUser])

    const getProductDetail = useCallback(async () => {
        if (typeof productId === "string" && productId) {
            try {
                const product = await fetchProductDetail(productId);
                if (product) {
                    setProduct(product);
                    const res = await fetch(
                        `${NEXT_PUBLIC_LOCAL}/api/get/info-seller?seller-id=${product.data[0].seller_id}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const data = await res.json();
                    if (res.status === 200) {
                        setInfoSeller(data);
                        setShippingFees({
                            [product.data[0].seller_id]: totalMoneyShip,
                        })
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [productId, totalMoneyShip]);

    useEffect(() => {
        getProductDetail()
    }, [param, getProductDetail]);

    useEffect(() => {
        const getShippingFee = async () => {
            if (!product || !addressShip || !infoSeller) return;
            try {
                const res = await axios.get('/api/ghtk/shipping-fee', {
                    params: {
                        pick_province: infoSeller.data.address.split(',')[3],
                        pick_district: infoSeller.data.address.split(',')[2],
                        province: addressShip.address.split(",")[3],
                        district: addressShip.address.split(",")[2],
                        weight: product.data[0].weight,
                        value: (product && quantityChoise * product.data[0].price),
                    },
                });
                setCheckAddress(true)
                setTotalMoneyShip(res.data.fee.fee + res.data.fee.insurance_fee);
            } catch (error) {
                console.error('Lỗi tính phí vận chuyển:', error);
            }
        };


        getShippingFee();
    }, [product, addressShip, infoSeller, quantityChoise]);


    const handlePay = async (valueNote: string) => {
        const productALL = [{ productID: product?.data[0]._id, quantity: quantityChoise, productName: product?.data[0].name , weight: product?.data[0].weight }]
        try {
            const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/add-orders`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    products: productALL,
                    seller_id: product?.data[0].seller_id,
                    payment_method: typePay,
                    address_ship: addressShip?._id,
                    total_money_ship: totalMoneyShip,
                    shipping_fees: shippingFees,
                    totalPay: totalPay,
                    note: valueNote
                })
            })
            if (res.status === 200) {
                setCheckPay(true)
                setTimeout(() => {
                    route.push(`/order?slug=1`)
                }, 2000)
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full max-sm:p-0 max-lg:p-10 max-xl:p-20 max-[1540px]:px-36 max-[1540px]:py-10 px-96 py-10">
            <div className="relative">
                <DeliveryAddress
                    userAddress={userAddress}
                    setUserAddress={setUserAddress}
                />
                <ProductChoisePay
                    infoSeller={infoSeller}
                    product={product}
                    checkAddress={checkAddress}
                    setQuantityChoise={setQuantityChoise}
                    quantityChoise={quantityChoise}
                    setTypePay={setTypePay}
                    totalMoneyShip={totalMoneyShip}
                    handlePay={handlePay}
                    setTotalPay={setTotalPay}
                />
                {checkPay && <div className="absolute top-0 w-full h-full flex justify-center items-center bg-neutral-100/50">
                    <Image src="/logo_.png" alt="logo" width={120} height={120} />
                </div>}
            </div>

        </div>
    );
}
