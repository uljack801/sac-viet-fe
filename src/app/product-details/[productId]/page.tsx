"use client";
import { useParams, useRouter } from "next/navigation";
import { fetchProductDetail } from "./components/fetchProductDetail";
import { useCallback, useEffect, useState } from "react";
import { ProductProps, ReviewProps } from "@/app/utils/fetchProduct";
import Image from "next/image";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchReview } from "./components/fetchReviews";
import { IoAddOutline } from "react-icons/io5";
import { IoRemoveOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { BsCartPlus } from "react-icons/bs";
import { useAuth } from "@/app/AuthContext";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { ShowAlert } from "@/app/helper/ShowAlert";
import { FaStar } from "react-icons/fa6";
import { LuUserRound } from "react-icons/lu";
import NotFound from "@/app/not-found";
import { OtherProductsOfShop } from "./components/OtherProductsOfShop";
import { ProductList } from "@/app/components/home/ProductList";

export default function ProductID() {
  const param = useParams();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [review, setReview] = useState<ReviewProps | null>(null);
  const [changeImg, setChangeImg] = useState(0);
  const [quantityChoise, setQuantityChoise] = useState<number>(1);
  const { setCart, accessToken, listProducts } = useAuth()
  const [showAlert, setShowAlert] = useState(false)
  const [checkProductDetail, setCheckProductDetail] = useState(true)
  const route = useRouter()
  const productId = param.productId;

  const getProductDetail = useCallback(async () => {
    if (typeof productId === "string" && productId) {
      try {
        const product = await fetchProductDetail(productId);
        const review = await fetchReview(productId);
        if (product) {
          setProduct(product);
          if (review) {
            setReview(review)
          }
        } else {
          setCheckProductDetail(false)
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    }
  }, [productId]);

  useEffect(() => {
    getProductDetail();
  }, [param.productId, getProductDetail]);

  const handleChoiseUp = () => {
    const inventory = product?.data[0].inventory
    if (inventory) {
      if (quantityChoise < inventory) {
        setQuantityChoise(quantityChoise + 1)
      }
    }
  }
  const handleChoisedown = () => {
    if (quantityChoise > 1) {
      setQuantityChoise(quantityChoise - 1)
    }
  }

  const handleAddProduct = async () => {
    if (!accessToken) {
      return route.push('/login')
    }
    try {
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/product-add-card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          productId: product?.data[0]._id,
          quantityChoise: quantityChoise
        })
      })
      if (res.status === 200) {
        setShowAlert(true)
        setTimeout(() => {
          setShowAlert(false)
        }, 1000);
        try {
          if (accessToken) {
            const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/cart`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              cache: "no-store",
            });

            if (!res.ok) throw new Error("Unauthorized");
            const data = await res.json();

            return setCart(data.data.flat());
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePayNow = () => {
    if (!accessToken) {
      route.push('/login')
      return
    }
    route.push(`/checkout?product-id=${productId}&quantity-product=${quantityChoise}`)
  }
  return (
    <div className="mt-28 mb-10 2xl:mx-80 xl:mx-40">
      {checkProductDetail ?
        (product?.data.map((value) => {
          return (
            <div key={`product-${value._id}`}>
              <div className="grid grid-cols-3 p-4 bg-white rounded-sm">
                <div className="col-span-1">
                  <Image
                    src={`/do-tho/${value.img[changeImg]}`}
                    alt="anh-san-pham"
                    width={300}
                    height={300}
                    className="w-full"
                  />
                  <div className="flex mt-1 ">
                    <Carousel
                      opts={{
                        align: "start",
                      }}
                      className="w-full relative"
                    >
                      <CarouselContent className="pl-4">
                        {value.img.map((valueImg, idx) => (
                          <CarouselItem key={idx} className="basis-1/5 pl-0">
                            <div className="p-1">
                              <Card className="p-0">
                                <CardContent className="flex aspect-square items-center justify-center p-0 cursor-pointer">
                                  <Image
                                    src={`/do-tho/${valueImg}`}
                                    alt="anh-san-pham"
                                    width={48}
                                    height={48}
                                    className="mx-1 w-full h-full"
                                    onClick={() => setChangeImg(idx)}
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="text-white hover:bg-inherit hover:text-white bg-inherit border-0 left-0 text-2xl" />
                      <CarouselNext className="text-white hover:bg-inherit hover:text-white bg-inherit border-0 right-0 text-2xl" />
                    </Carousel>
                  </div>
                </div>
                <div className="col-span-2 ml-10 relative">
                  <p className="text-xl">{value.name}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex justify-center items-center mr-4"><p className="border-b-1 mr-1">{review?.data?.length
                      ? (review.data.reduce((acc, value) => acc + value.rating, 0) / review.data.length).toFixed(1)
                      : "chưa có đánh giá"}</p><span hidden={review?.data?.length ? false : true}><FaStar className="text-yellow-300" /></span></div>
                    <div className="flex justify-center items-center mr-4" hidden={review?.data?.length ? false : true}>
                      <p className="border-b-1 mr-1" >{review?.data.length}</p><span className="text-sm text-neutral-600">Đánh giá</span>
                    </div>
                    <div className="flex justify-center items-center"><p className="border-b-1 mr-1">{value.sold}</p> <span className="text-sm text-neutral-600">Lượt bán</span></div>
                  </div>
                  <div>
                    <p className="text-sm mt-4 line-through">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value.price)}</p>
                    <p className="text-3xl mt-1 text-red-500">{new Intl.NumberFormat("vi-Vn", { style: "currency", currency: "VND" }).format((value.price / 100) * (100 - value.discount_percentage))} <span className="text-sm">-{value.discount_percentage}%</span>
                    </p>
                  </div>
                  <div >
                    <p className="mt-4 text-sm text-neutral-400">An tâm mua sắm cùng Sắc Việt</p>
                    <div className="grid-cols-6 mt-2 text-xs justify-between items-center">
                      <p className="">Đổi trả miễn phí trong vòng 15 ngày</p>
                      <p className="">Hỗ trợ giao hàng tận nhà</p>
                      <p className="">100% Hoàn tiền nếu sản phẩm lỗi</p>
                      <p className="">Thanh toán Với nhiều phương thức</p>
                    </div>
                  </div>
                  <div>
                  </div>
                  <div className="mt-10 bottom-0">
                    <div className="flex items-center mb-10 text-xl w-auto xl:mb-6 xl:text-sm">
                      <Button onClick={() => handleChoisedown()} className="border mr-2 bg-white text-black hover:bg-white"><IoRemoveOutline /></Button>
                      <span className="flex justify-center items-center w-6 text-sm"> {quantityChoise}</span>
                      <Button onClick={() => handleChoiseUp()} className="border ml-2 bg-white text-black hover:bg-white"><IoAddOutline /></Button>
                      <span className="ml-6 text-sm text-neutral-400 xl:text-xs">{value.inventory} sản phẩm có sẵn</span>
                    </div>
                    <div className="flex items-center">
                      <Button className="2xl:p-6 xl:p-4 bg-inherit text-red-500 shadow-0 border stringed-300 hover:bg-inherit px-10" onClick={() => handleAddProduct()}><BsCartPlus />Thêm vào giỏ hàng</Button>
                      <Button className="2xl:p-6 xl:p-4 bg-red-500 text-white shadow-0 hover:bg-red-500/85 px-10 ml-2" onClick={() => handlePayNow()}>Mua ngay</Button>
                    </div>
                  </div>
                </div>
                {showAlert && ShowAlert("Thêm sản phẩm thành công!")}
              </div>
              <div className="p-4 bg-white rounded-sm mt-3">
                <p className="2xl:text-2xl font-medium mb-6 xl:text-xl">Chi tiết sản phẩm</p>
                <p className="2xl:text-xl font-medium mb-4 xl:text-sm">{value.name}</p>
                <p dangerouslySetInnerHTML={{ __html: value.description }} className="xl:text-sm"></p>
                <p>chiều cao: {value.dimensions}</p>
                <p>{value.handmade && "Hàng thủ công"}</p>
                <p>Nguồn gốc: {value.origin}</p>
                <p>Số lượng trong kho: {value.inventory}</p>
                <p className="2xl:text-2xl font-medium my-6 xl:text-xl">Hướng dẫn sử dụng</p>
                <p className="xl:text-sm">{value.care_instructions}</p>
              </div>
              <div className="p-4 bg-white rounded-sm mt-3 min-h-96">
                <p className="2xl:text-2xl font-medium mb-6 xl:text-xl">Đánh giá sản phẩm</p>
                {review?.data.length ? review?.data.slice(0, 6).map((value) => {
                  return (
                    <div key={`review-${value._id}`} className="my-6">
                      <div className="flex mb-2">
                        <LuUserRound className="text-3xl" />
                        <div>
                          <p>
                            {value.user_name.slice(0, 6) +
                              "*".repeat(value.user_name.length - 11) +
                              value.user_name.slice(-5)}
                          </p>                          <div className="flex">
                            {[...Array(value.rating)].map((_, idx) => (
                              <FaStar className="text-yellow-300" key={idx} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p>{value.comment}</p>
                      <div className="flex">
                        {value.images.map((value, idx) => (
                          <Image key={`anh-review-${idx}`} src={`/do-tho/${value}`} alt={value} width={60} height={60} className="mx-2" />
                        ))}
                      </div>
                    </div>
                  )
                }) :
                  <div className="flex justify-center items-center mt-20 text-neutral-200">
                    <p>Chưa có đánh giá nào.</p>
                  </div>  
                }
              </div>
              <OtherProductsOfShop sellerID={product?.data[0].seller_id} />
              <p className="font-medium 2xl:text-2xl p-4 py-6 bg-white rounded-sm shadow my-3 xl:text-xl">Có thể bạn cũng thích</p>
              <ProductList listProducts={listProducts} />
            </div>
          );
        })) :
        <NotFound />
      }
    </div>
  );
}

