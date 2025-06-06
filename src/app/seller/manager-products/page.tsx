"use client"

import { useAuth } from "@/app/AuthContext"
import { useEffect, useState } from "react"
import { fetchProductFollowSeller } from "./components/fetchProductFollowSeller"
import { ProductProps } from "@/app/utils/fetchCategory"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { fetchChangeStatus } from "./components/fetchChangeStatus"
import { useAuthSeller } from "../AuthContext"
import { PaginationProducts } from "@/app/[category]/components/Pagination"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { UpdateProduct } from "./components/UpdateProduct"
import { TfiReload } from "react-icons/tfi";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ManagerProducts() {
    const [checkChangeStatus, setCheckChangeStatus] = useState(false)
    const { accessToken } = useAuth()
    const { infoSeller } = useAuthSeller()
    const [listProducts, setListProducts] = useState<ProductProps | undefined>()
    const [alertUpdate, setAlertUpdate] = useState(false)
    const [sortProduct, setSortProduct] = useState<string | undefined>()
    const searchParam = useSearchParams()
    const page = searchParam.get("page") || "1"

    
    useEffect(() => {
        if (accessToken && infoSeller) {
            fetchProductFollowSeller(accessToken, infoSeller?.data._id, page, setListProducts,sortProduct )
        }
    }, [accessToken, infoSeller, page, alertUpdate,sortProduct])

    const handleChange = async (productID: string) => {
        if (accessToken && infoSeller) {
            const status = await fetchChangeStatus(productID, infoSeller?.data._id, accessToken)
            if (status === 200) {
                await fetchProductFollowSeller(accessToken, infoSeller?.data._id, page, setListProducts ,sortProduct)
                setCheckChangeStatus(true)
                setTimeout(() => setCheckChangeStatus(false), 2000)
            }
        }
    }

    const handleReload = () => {
        if (accessToken && infoSeller) {
            fetchProductFollowSeller(accessToken, infoSeller?.data._id, page, setListProducts ,sortProduct)
        }
    }

    useEffect(() => {
        if (alertUpdate) {
            setTimeout(() => setAlertUpdate(false), 2000)
        }
    }, [alertUpdate])

    
    return (
        <div className="2xl:p-10 xl:p-4 ">
            <p className="text-2xl mb-4 font-medium">Danh sách Sản Phẩm</p>
            <div className="flex justify-end mb-2">
                <Select onValueChange={(value) => { 
                    if(value === 'no-choise'){
                        setSortProduct(undefined)
                    }else{
                         setSortProduct(value);
                    }
                }}>
                    <SelectTrigger className="w-[180px] mr-2 bg-white">
                        <SelectValue placeholder="Sắp xếp sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="best-seller">SP bán chạy</SelectItem>
                            <SelectItem value="slow-seller">SP bán chậm</SelectItem>
                            <SelectItem value="in-stock">SP tồn kho</SelectItem>
                            <SelectItem value="out-of-stock">SP hết hàng</SelectItem>
                            <SelectItem value="high-discount">SP giảm giá cao</SelectItem>
                            <SelectItem value="low-discount">SP giảm giá thấp</SelectItem>
                            <SelectItem value="no-choise">Bỏ chọn</SelectItem>    
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <TfiReload onClick={handleReload} className="text-xl m-2" title="tải lại dữ liệu" />
            </div>
            <div className=" bg-[#fafafa] p-2 border rounded-sm">
                <div className="grid grid-cols-12 items-center mb-4 border xl:text-xs 2xl:text-sm">
                    <p className="flex justify-center col-span-6 border-r p-2 ">Sản phẩm</p>
                    <p className="flex justify-center border-r p-2">Giá bán</p>
                    <p className="flex justify-center border-r p-2">Đã bán</p>
                    <p className="flex justify-center border-r p-2">Tồn kho</p>
                    <p className="flex justify-center border-r p-2">Trạng thái</p>
                    <p className="flex justify-center border-r p-2">Giảm giá %</p>
                    <p className="flex justify-center  p-2">Xem chi tiết</p>
                </div>
                <div className="border">
                    {listProducts && listProducts?.data.map((product, idx) => {
                        return (
                            <div key={product._id} className={cn("grid grid-cols-12 items-center ", idx !== listProducts.data.length - 1 && "border-b")} >
                                <div className="col-span-6 flex  border-r p-1">
                                    <Image src={product.img[0]} alt={product.name} width={48}
                                        height={48}
                                        className="object-cover" />
                                    <p className="text-xs ml-1 mr-2 line-clamp-2">{product.name}</p>
                                </div>
                                <p className="flex justify-center items-center border-r 2xl:text-sm xl:text-xs h-full">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((product.price - (product.price * (product.discount_percentage / 100))))}</p>
                                <p className="flex justify-center items-center border-r h-full">{product.sold}</p>
                                <p className="flex justify-center  items-center border-r h-full" >{product.inventory}</p>
                                <p className="flex justify-center  items-center border-r h-full"><Switch checked={product.status} onCheckedChange={() => handleChange(product._id)} className={cn(product.status && "bg-green-500")} /></p>
                                <p className="flex justify-center  items-center border-r h-full">{product.discount_percentage}</p>
                                <div className="flex justify-center items-center text-xs border-r h-full p-1">
                                    <UpdateProduct product={product} setAlertUpdate={setAlertUpdate} />
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
            <div className=" mt-2">
                {(listProducts && listProducts?.totalPages > 1) && <PaginationProducts listProducts={listProducts} param={`seller/manager-products`} />}

            </div>
            {checkChangeStatus || alertUpdate &&
                <Alert className="absolute top-10 right-0 w-auto px-10 mr-1 bg-green-200/30 text-green-400/65 border-0">
                    <Terminal />
                    <AlertTitle>Cập nhật sản phẩm thành công!</AlertTitle>
                    <AlertDescription></AlertDescription>
                </Alert>
            }
        </div>
    )
}