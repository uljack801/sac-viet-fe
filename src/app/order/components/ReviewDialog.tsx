"use client"
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DataType } from "./AllOrder";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/AuthContext";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { useRouter } from "next/navigation";

export type ReviewProps = {
  product_id: string;
  rating: number;
  comment: string;
  imageFile?: File | null;
  imagePreviewUrl?: string;
  user_id?: string | undefined;
  user_name?: string | undefined;
};

export function ReviewDialog({
  mergedOrders,
  ordersID,
}: {
  mergedOrders: DataType;
  ordersID: string;
}) {
  const [reviews, setReviews] = useState<Record<string, ReviewProps>>({});
  const { dataUser, accessToken } = useAuth()
  const route = useRouter();
  const handleRate = (productId: string, rating: number) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        product_id: productId,
        rating,
        comment: prev[productId]?.comment || "",
        imageFile: prev[productId]?.imageFile || null,
        imagePreviewUrl: prev[productId]?.imagePreviewUrl || "",
        user_id: dataUser?.data._id,
        user_name: dataUser?.data.email,
      },
    }));
  };

  const handleCommentChange = (
    productId: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const comment = e.target.value;
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        product_id: productId,
        comment,
        rating: prev[productId]?.rating || 0,
        imageFile: prev[productId]?.imageFile || null,
        imagePreviewUrl: prev[productId]?.imagePreviewUrl || "",
        user_id: dataUser?.data._id,
        user_name: dataUser?.data.email,
      },
    }));
  };

  const handleImageChange = (
    productId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        product_id: productId,
        imageFile: file,
        imagePreviewUrl: previewUrl,
        rating: prev[productId]?.rating || 0,
        comment: prev[productId]?.comment || "",
        user_id: dataUser?.data._id,
        user_name: dataUser?.data.email,
      },
    }));
  };

  const handleSubmit = () => {
    const review = Object.values(reviews);
    review.map(async items => {
        if (accessToken ) {
          const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/add-review`, {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              product_id: items.product_id,
              user_id: items.user_id,
              user_name: items.user_name,
              rating: items.rating,
              comment: items.comment,
              orderID: ordersID,
            })
          })
          if (res.status === 200) {
            route.refresh()
          }
        }
    })
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="text-white hover:text-white px-10 py-5 bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] mr-1"
        >
          Đánh giá
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="mt-10 max-h-[600px] overflow-auto rounded-none ">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">Đánh giá sản phẩm</AlertDialogTitle>
          {mergedOrders?.map((orders) => {
            if (ordersID === orders._id) {
              return (
                <div key={orders._id} className="rounded-sm bg-white relative">
                  {orders.products.map((product) => {
                    const productId = product.product?._id || "";
                    const review = reviews[productId] || {
                      rating: 0,
                      comment: "",
                      imageFile: null,
                      imagePreviewUrl: "",
                      product_id: productId,
                    };

                    return (
                      product.product && (
                        <div
                          key={`order-${orders._id}-product-${productId}`}
                          className="mt-6"
                        >
                          <div className="grid grid-cols-1 border p-2 m-1 rounded-sm items-center">
                            <div className="flex my-2">
                              <Image
                                src={`${product.product?.img[0]}`}
                                alt={`${product.product?.name}`}
                                width={48}
                                height={48}
                              />
                              <div className="flex items-center">
                                <p className="text-ellipsis line-clamp-1 mx-2">
                                  {product.product?.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <p className="mr-4">Chất lượng sản phẩm: </p>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar
                                  key={i}
                                  onClick={() => handleRate(productId, i + 1)}
                                  className={cn(
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300",
                                    "text-2xl cursor-pointer"
                                  )}
                                />
                              ))}
                            </div>
                            <div className="mt-6">
                              <Textarea
                                className="w-full max-h-60 resize-none overflow-y-auto p-2 border rounded"
                                placeholder="Viết đánh giá của bạn"
                                value={review.comment}
                                onChange={(e) => handleCommentChange(productId, e)}
                              />
                            </div>
                            <div className="mt-2">
                              <Input
                                type="file"
                                className="w-1/2"
                                accept="image/*"
                                onChange={(e) => handleImageChange(productId, e)}
                              />
                              {review.imagePreviewUrl && (
                                <Image
                                  src={review.imagePreviewUrl}
                                  alt="Preview"
                                  width={60}
                                  height={60}
                                  className="mt-2 border"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              );
            }
            return null;
          })}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} className="text-white hover:text-white  bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] ">Đánh giá</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
