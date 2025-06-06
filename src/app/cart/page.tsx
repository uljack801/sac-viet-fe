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
        <div className=" mt-28 mb-10 2xl:mx-52 xl:mx-40 lg:mx-32 sm:mx-20">
            <div className="grid grid-cols-2 bg-white p-6 items-center rounded-sm ">
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
                    <div className="bg-white min-h-screen p-6 mt-2 rounded-sm ">
                        {groupProduct?.map((group) => (
                            <div key={`seller-${group.seller?.data._id}`} className="mb-6">
                                <div className="font-semibold text-lg mb-2 xl:text-sm">
                                    <label>{group.seller?.data.nameShop}</label>
                                </div>
                                {group.products?.map((value) => (
                                    <div key={`product-${value._id}`} className="flex justify-center items-center">
                                        <Checkbox
                                            className="mr-2"
                                            checked={checkedProducts.includes(value._id)}
                                            onCheckedChange={() => handleCheckSingle(value._id)}
                                        />
                                        <div className="grid grid-cols-2 items-center mt-4 border rounded-sm py-1 w-full">
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
                                            <div className="grid grid-cols-4 text-center items-center">
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
                                                <p className="cursor-pointer" onClick={() => hanldedeleteProduct(value._id)}>Xóa</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-6 mt-2 flex items-center justify-between sticky bottom-0 z-10 border-t rounded-sm ">
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
                <div className="bg-white min-h-96 p-6 mt-2 rounded-sm flex justify-center items-center ">
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
