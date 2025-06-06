"use client"
import { CiEdit } from "react-icons/ci";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ProductPropsSingle } from "@/app/utils/fetchCategory";
import { useAuth } from "@/app/AuthContext";
import { useEffect, useState } from "react";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { uploadImage } from "@/app/helper/uploadImage";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { GrSubtractCircle } from "react-icons/gr";
import { IoAddCircleOutline } from "react-icons/io5";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import Image from "next/image"

export const UpdateProduct = ({ product, setAlertUpdate }: { product: ProductPropsSingle; setAlertUpdate: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { accessToken } = useAuth();
    const [lengthArrayImg, setLengthArrayImg] = useState<number[]>([1]);
    const [listImg, setListImg] = useState<File[]>([]);
    const [discount, setDiscount] = useState(product.discount_percentage)
    const [nameProduct, setNameProduct] = useState<string>(product.name)
    const [price, setPrice] = useState<number>(product.price)
    const [colors, setColors] = useState<string[]>(product.color);
    const [material, setMaterial] = useState<string[]>(product.material);
    const [height, setHeight] = useState(product.dimensions.split('x')[2] || '')
    const [weight, setWeight] = useState(product.dimensions.split('x')[0] || '')
    const [length, setLength] = useState(product.dimensions.split('x')[1] || '')
    const [origin, setOrigin] = useState(product.origin)
    const [warranty, setWarranty] = useState(product.warranty)
    const [careInstructions, setCareInstructions] = useState(product.care_instructions)
    const [description, setDescription] = useState(product.description)
    const [inventory, setInventory] = useState<number>(product.inventory)
    const [tags, setTags] = useState<string[]>(product.tags);
    const [heft, setHeft] = useState<number>(product.weight)

    useEffect(() => { }, [product])
    const handleAddLength = () => {
        if (lengthArrayImg.length < 10) {
            setLengthArrayImg(prev => [...prev, prev.length > 0 ? prev[prev.length - 1] + 1 : 0]);
            setListImg(prev => [...prev]);
        }
    };
    const handleSubtractionLength = (idx: number) => {
        setLengthArrayImg(prev => prev.filter((_, index) => index !== idx));
        setListImg(prev => prev.filter((_, index) => index !== idx));
    };

    const handleChangeFile = (index: number, file: File | null) => {
        if (file) {
            const newImg = [...listImg];
            newImg[index] = file
            setListImg(newImg);
        }
    };


    const handleAddColor = () => {
        if (colors.length < 5) {
            setColors([...colors, ""]);
        }
    };

    const handleRemoveColor = (index: number) => {
        const newColors = colors.filter((_, i) => i !== index);
        setColors(newColors);
    };

    const handleChangeColor = (index: number, value: string) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);
    };


    const handleAddMaterial = () => {
        if (material.length < 5) {
            setMaterial([...material, ""]);
        }
    };

    const handleRemoveMaterial = (index: number) => {
        const newMaterial = material.filter((_, i) => i !== index);
        setMaterial(newMaterial);
    };

    const handleChangeMaterial = (index: number, value: string) => {
        const newMaterial = [...material];
        newMaterial[index] = value;
        setMaterial(newMaterial);
    };
    const handleAddTags = () => {
        if (tags.length < 5) {
            setTags([...tags, ""]);
        }
    };

    const handleRemoveTags = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
    };

    const handleChangeTags = (index: number, value: string) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };


    const addproduct = async () => {
        try {
            const uploadUrls = await Promise.all(
                listImg
                    .filter((file): file is File => file !== null && file !== undefined)
                    .map((file) => uploadImage(file))
            );
            const dataProduct = {
                productID: product._id,
                name: nameProduct,
                img: uploadUrls ? [...product.img, ...uploadUrls] : uploadUrls,
                discount_percentage: discount,
                price: price,
                color: colors,
                material: material,
                dimensions: `${length} x ${weight} x ${height}`,
                origin: origin,
                warranty: warranty,
                care_instructions: careInstructions,
                description: description,
                inventory: inventory,
                tags: tags,
                weight: heft,
            };
            if (accessToken) {
              const res =   await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-product`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ dataProduct: dataProduct })
                })
                if(res.status ===200){
                    setAlertUpdate(true)
                }
            }

        } catch (error) {
            console.error("Lỗi upload ảnh hoặc thêm sản phẩm:", error);
        }
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <CiEdit className="text-xl" />
            </AlertDialogTrigger>
            <AlertDialogContent className="h-2/3 w-2/3 p-0">
                <AlertDialogHeader className="overflow-auto ">
                    <AlertDialogTitle className="mt-10 flex justify-center">Cập nhật sản phẩm</AlertDialogTitle>
                    <div >
                        <div className="bg-white rounded-sm min-h-96 mt-4 p-10 shadow">
                            <div className="grid grid-cols-6 items-center">
                                <Label className="col-span-2">Tên sản phẩm: *</Label>
                                <Input className="col-span-4" value={nameProduct} onChange={(e) => setNameProduct(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Thêm ảnh: *</Label>
                                <div className="flex border rounded-sm items-center justify-center cursor-pointer col-span-4 h-full py-2">
                                    <IoAddCircleOutline
                                        onClick={handleAddLength}
                                        title="thêm ảnh"
                                    />
                                </div>
                            </div>
                            {lengthArrayImg.map((item, idx) => (
                                <div key={`img-add-${item}`} className="grid grid-cols-6 mt-2">
                                    <GrSubtractCircle
                                        onClick={() => handleSubtractionLength(idx)}
                                        className="h-full flex items-center ml-2 cursor-pointer col-span-2 "
                                        title="xóa ảnh"
                                    />
                                    <Input type="file" accept="image/*" className="col-span-4" onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        handleChangeFile(idx, file);
                                    }} />

                                </div>
                            ))}
                            <div className="grid grid-cols-4 gap-1 mt-4">
                                {product.img.map((src, idx) => (
                                    <Image key={idx} src={`${src}`} alt="anh-san-pham" width={48} height={48} className="w-full h-full object-center border rounded-sm" />
                                ))}
                            </div>
                            <div className="grid grid-cols-6  py-4">
                                <Label className="col-span-2">Giảm giá: {discount} %</Label>
                                <Slider defaultValue={[discount]} onValueChange={(value) => { setDiscount(value[0]) }} max={100} step={1} className="col-span-4" />
                            </div>
                            <div className="grid grid-cols-6">
                                <Label className="col-span-2">Giá bán: *</Label>
                                <Input type="number" min={0} className="col-span-4" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                            </div>
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Màu sắc:</Label>
                                <div className="flex border rounded-sm items-center justify-center cursor-pointer col-span-4 h-full py-2">
                                    <IoAddCircleOutline
                                        onClick={handleAddColor}
                                        className="cursor-pointer"
                                        title="Thêm màu"
                                    />
                                </div>
                            </div>
                            {colors.map((color, index) => (
                                <div className="grid grid-cols-6 mt-2" key={index}>
                                    <div className="flex items-center ml-2 col-span-2">
                                        <GrSubtractCircle
                                            onClick={() => handleRemoveColor(index)}
                                            className="cursor-pointer"
                                            title="Xóa màu"
                                        />
                                    </div>
                                    <Input
                                        className="col-span-4"
                                        value={color}
                                        onChange={(e) => handleChangeColor(index, e.target.value)}

                                    />
                                </div>
                            ))}
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Vật liệu: *</Label>
                                <div className="flex border rounded-sm items-center justify-center cursor-pointer col-span-4 h-full py-2">
                                    <IoAddCircleOutline
                                        onClick={handleAddMaterial}
                                        className="cursor-pointer"
                                        title="Thêm vật liệu"
                                    />
                                </div>
                            </div>
                            {material.map((material, index) => (
                                <div className="grid grid-cols-6 mt-2" key={index}>
                                    <div className="flex items-center ml-2 col-span-2">
                                        <GrSubtractCircle
                                            onClick={() => handleRemoveMaterial(index)}
                                            className="cursor-pointer"
                                            title="Xóa vật liệu"
                                        />
                                    </div>
                                    <Input
                                        className="col-span-4"
                                        value={material}
                                        onChange={(e) => handleChangeMaterial(index, e.target.value)}

                                    />

                                </div>
                            ))}
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Kích thước: (cm)</Label>
                                <div className="mr-4">
                                    <Input value={length} onChange={(e) => setLength(e.target.value)} />
                                </div>
                                <div className="mr-4">
                                    <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
                                </div>
                                <div className="mr-4">
                                    <Input value={height} onChange={(e) => setHeight(e.target.value)} />
                                </div>
                                <p className="text-xs h-full flex items-center ">(Dài-Rộng-Cao)</p>
                            </div>
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Nguồn gốc: </Label>
                                <Input className="col-span-4" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Chính sách bảo hành: </Label>
                                <Input className="col-span-4" value={warranty} onChange={(e) => setWarranty(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Hướng dẫn bảo quản: *</Label>
                                <Textarea className="col-span-4" value={careInstructions} onChange={(e) => setCareInstructions(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Mô tả: *</Label>
                                <Textarea className="col-span-4" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Hàng tồn kho: *</Label>
                                <Input type="number" min={0} className="col-span-4" value={inventory} onChange={(e) => setInventory(Number(e.target.value))} />
                            </div>
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Thẻ tìm kiếm: *</Label>
                                <div className="flex border rounded-sm items-center justify-center cursor-pointer col-span-4 h-full py-2">
                                    <IoAddCircleOutline
                                        onClick={handleAddTags}
                                        className="cursor-pointer"
                                        title="Thêm thẻ"
                                    />
                                </div>
                            </div>
                            {tags.map((tags, index) => (
                                <div className="grid grid-cols-6 mt-2" key={index}>
                                    <div className="flex items-center ml-2 col-span-2">
                                        <GrSubtractCircle
                                            onClick={() => handleRemoveTags(index)}
                                            className="cursor-pointer"
                                            title="Xóa thẻ"
                                        />
                                    </div>
                                    <Input
                                        className="col-span-4"
                                        value={tags}
                                        onChange={(e) => handleChangeTags(index, e.target.value)}

                                    />
                                </div>
                            ))}
                            <div className="grid grid-cols-6 mt-2">
                                <Label className="col-span-2">Trọng lượng: *</Label>
                                <Input type="number" value={heft} min={0} className="col-span-4" onChange={(e) => setHeft(Number(e.target.value))} />
                            </div>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="p-6">
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={addproduct} className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]">Cập nhật</AlertDialogAction>
                </AlertDialogFooter>
             
            </AlertDialogContent>
        </AlertDialog>
    )
}

