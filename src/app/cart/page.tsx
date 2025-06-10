"use client"
import { useAuth } from "../AuthContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { NEXT_PUBLIC_LOCAL } from "../helper/constant";
import { useCallback, useEffect, useState } from "react";
import { InfoSellerProps } from "../checkout/components/ProductChoisePay";
import { ProductListProps } from "../utils/fetchCategory";
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation";
import { GiCardboardBox } from "react-icons/gi";

export type GroupedProductsProps = {
    seller: InfoSellerProps | undefined;
    products: ProductListProps[] | undefined;
}[];

export default function Card() {
    const { cart, accessToken, setCart } = useAuth();
    const [sellerID, setSellerID] = useState<string[]>([]);
    const [groupProduct, setGroupProduct] = useState<GroupedProductsProps>();
    const [isChecked, setIsChecked] = useState(false);
    const [checkedProducts, setCheckedProducts] = useState<string[]>([]);

    const getInfoSeller = useCallback(async (paramSellerId: string) => {
        try {
            const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/info-seller?seller-id=${paramSellerId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data: InfoSellerProps = await res.json();
            if (res.status === 200) return data;
        } catch (error) {
            console.log(error);
        }
    }, []);
    const [selectedProducts, setSelectedProducts] = useState<GroupedProductsProps>();
    const route = useRouter()

    useEffect(() => {
        if (cart?.length) {
            const uniqueSellers = Array.from(new Set(cart.map(item => item.seller_id)));
            setSellerID(uniqueSellers);
        }
    }, [cart]);

    useEffect(() => {
        if (!cart || cart.length === 0) {
            setGroupProduct([]);
            return;
        }
        const fetchGroupedProducts = async () => {
            const grouped = await Promise.all(
                sellerID.map(async (seller) => ({
                    seller: await getInfoSeller(seller),
                    products: cart?.filter(item => item.seller_id === seller),
                }))
            );
            setGroupProduct(grouped);
        };

        fetchGroupedProducts();
    }, [cart, getInfoSeller, sellerID]);

    const handleChoiseUp = async (id: string, quantityChoise: number, totalProduct: number) => {
        if (quantityChoise < totalProduct) quantityChoise += 1;
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/cart`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ idProduct: id, quantity: quantityChoise })
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        return setCart(data.data.flat());
    };

    const handleChoisedown = async (id: string, quantityChoise: number) => {
        if (quantityChoise > 1) quantityChoise -= 1;
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/cart`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ idProduct: id, quantity: quantityChoise })
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        return setCart(data.data.flat());
    };

    const hanldedeleteProduct = async (id: string) => {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/delete/cart`, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ idProduct: id })
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        return setCart(data.data.flat());
    };

    const handleCheckAll = () => {
        if (groupProduct) {
            const allProductIds = groupProduct.flatMap(group => group.products?.map(p => p._id) || []);
            if (isChecked) {
                setCheckedProducts([]);
                setSelectedProducts([]);
            } else {
                setCheckedProducts(allProductIds);
                setSelectedProducts(groupProduct)
            }
            setIsChecked(!isChecked);
        }
    };

    const handleCheckSingle = (productId: string) => {
        if (checkedProducts.includes(productId)) {
            setCheckedProducts(prev => prev.filter(id => id !== productId));

            setSelectedProducts(prev => {
                const updated = prev?.map(group => {
                    return {
                        seller: group.seller,
                        products: group.products?.filter(product => product._id !== productId)
                    };
                }).filter(group => group.products && group.products.length > 0);
                return updated;
            });

        } else {
            setCheckedProducts(prev => [...prev, productId]);
            groupProduct?.forEach(group => {
                const product = group.products?.find(p => p._id === productId);
                if (product) {
                    setSelectedProducts(prev => {
                        const safePrev = prev || [];
                        const existingGroup = safePrev.find(item => item.seller?.data._id === group.seller?.data._id);
                        if (existingGroup) {
                            const alreadyIn = existingGroup.products?.some(p => p._id === product._id);
                            if (!alreadyIn) {
                                return safePrev.map(item =>
                                    item.seller?.data._id === group.seller?.data._id
                                        ? { ...item, products: [...(item.products || []), product] }
                                        : item
                                );
                            }
                            return safePrev;
                        } else {
                            return [...safePrev, { seller: group.seller, products: [product] }];
                        }
                    });
                }
            });
        }
    };
    useEffect(() => {
        if (groupProduct) {
            const allIds = groupProduct.flatMap(group => group.products?.map(p => p._id) || []);
            setIsChecked(checkedProducts.length === allIds.length && allIds.length > 0);
        }
    }, [checkedProducts, groupProduct]);

    const handleCheckout = () => {
        if (selectedProducts && selectedProducts.length > 0) {
            localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
            route.push("/cart/checkout")
        }
    }

    return (
        <div className=" mt-28 mb-10 max-lg:p-0 max-xl:p-10 max-[1540px]:px-36  max-[1540px]:py-10 px-96 py-10">
            <div className="grid grid-cols-2 bg-white p-6 items-center rounded-sm max-sm:hidden max-lg:hidden">
                <p className="2xl:text-2xl font-medium xl:text-xl">Danh sách giỏ hàng</p>
                <div className="grid grid-cols-4 text-neutral-400 text-center">
                    <p>Đơn giá</p>
                    <p>Số lượng</p>
                    <p>Số tiền</p>
                    <p>Thao tác</p>
                </div>
            </div>
            {groupProduct?.length ? (
                <div>
                    <div className="bg-white min-h-screen mt-2 rounded-sm max-sm:m-2 shadow max-sm:p-2 max-lg:m-2 max-lg:p-6 max-xl:p-6 max-[1540px]:p-10 p-10">
                        {groupProduct?.map((group) => (
                            <div key={`seller-${group.seller?.data._id}`}>
                                <div className="font-semibold max-lg:text-xl max-sm:text-sm">
                                    <label>{group.seller?.data.nameShop}</label>
                                </div>
                                {group.products?.map((value) => (
                                    <div key={`product-${value._id}`} className="flex items-center">
                                        <Checkbox
                                            className="mr-2"
                                            checked={checkedProducts.includes(value._id)}
                                            onCheckedChange={() => handleCheckSingle(value._id)}
                                        />
                                        <div className="grid grid-cols-2 items-center mt-4 border rounded-sm py-1 w-full max-sm:hidden">
                                            <div className="flex items-center">
                                                <Image
                                                    src={`${value.img[0]}`}
                                                    alt="anh-san-pham"
                                                    width={90}
                                                    height={90}
                                                    className="mx-1"
                                                />
                                                <p className="text-sm mx-2 line-clamp-2">{value.name}</p>
                                            </div>
                                            <div className="flex justify-between text-center items-center">
                                                <p>
                                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price / 100) * (100 - value.discount_percentage))}
                                                </p>
                                                <div className="flex justify-center items-center text-xl w-auto">
                                                    <Button onClick={() => handleChoisedown(value._id, value.quantity)} className="border mr-2 bg-white text-black hover:bg-white">
                                                        <IoRemoveOutline />
                                                    </Button>
                                                    <span className="flex justify-center items-center w-4 text-xs">{value.quantity}</span>
                                                    <Button onClick={() => handleChoiseUp(value._id, value.quantity, value.inventory)} className="border ml-2 bg-white text-black hover:bg-white">
                                                        <IoAddOutline />
                                                    </Button>
                                                </div>
                                                <p className="text-red-400">
                                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price / 100) * (100 - value.discount_percentage) * value.quantity)}
                                                </p>
                                                <p className="cursor-pointer mr-2" onClick={() => hanldedeleteProduct(value._id)}>x</p>
                                            </div>
                                        </div>
                                        <div className="max-sm:block hidden w-full">
                                            <div className="mt-4 border rounded-sm w-full">
                                                <div className="flex items-center justify-between w-full p-1">
                                                    <Image
                                                        src={`${value.img[0]}`}
                                                        alt="anh-san-pham"
                                                        width={60}
                                                        height={60}
                                                        className="mx-1"
                                                    />
                                                    <div className="w-full">
                                                        <p className="text-xs line-clamp-2">{value.name}</p>
                                                        <div className="flex text-center justify-between items-end mt-1">
                                                            <div className="flex items-end">
                                                                {value.discount_percentage > 0 &&
                                                                    <p className="text-red-400">
                                                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price / 100) * (100 - value.discount_percentage) * value.quantity)}
                                                                    </p>}
                                                                {value.discount_percentage > 0 &&
                                                                    <p className="text-[10px] ml-2">
                                                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price))}
                                                                    </p>}
                                                                {value.discount_percentage === 0 &&
                                                                    <p >
                                                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((value.price))}
                                                                    </p>}
                                                            </div>
                                                            <div className="flex justify-center items-center text-xs w-auto mr-2">
                                                                <IoRemoveOutline onClick={() => handleChoisedown(value._id, value.quantity)} />
                                                                <span className="flex justify-center items-center w-4 text-xs">{value.quantity}</span>
                                                                <IoAddOutline onClick={() => handleChoiseUp(value._id, value.quantity, value.inventory)} />
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <Button className=" bg-neutral-200 mx-1" onClick={() => hanldedeleteProduct(value._id)}>x</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="max-sm:p-2 max-lg:p-4 max-xl:p-6 max-lg:m-2 p-6  bg-white mt-2 flex items-center justify-between sticky bottom-0 z-10 shadow border-t rounded-sm ">
                        <div>
                            <Checkbox
                                id="selectAll"
                                className="mr-2"
                                checked={isChecked}
                                onCheckedChange={handleCheckAll}
                            />
                            <label htmlFor="selectAll">Chọn tất cả</label>
                        </div>
                        <div>
                            <Button className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] text-white"
                                onClick={handleCheckout}
                            >
                                Thanh Toán
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white min-h-96 p-6 mt-2 rounded-sm flex justify-center items-center max-lg:m-4">
                    <div className="flex flex-col items-center">
                        <GiCardboardBox className="text-6xl" />
                        <p>Chưa có sản phẩm nào trong giỏ hàng</p>
                        <Button className="mt-2 bg-[#C95050] text-white hover:bg-[#c9505098]" onClick={() => route.push('/')}>Quay lại trang mua sắm !</Button>
                    </div>
                </div>
            )}

        </div>
    );
}
