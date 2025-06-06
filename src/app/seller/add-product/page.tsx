"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { GrSubtractCircle } from "react-icons/gr";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { useAuthSeller } from "../AuthContext";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadImage } from "@/app/helper/uploadImage";

export default function AddProduct() {
  const { listCategory, accessToken } = useAuth();
  const { infoSeller } = useAuthSeller()
  const [lengthArrayImg, setLengthArrayImg] = useState<number[]>([1]);
  const [listImg, setListImg] = useState<File[]>([]);
  const [discount, setDiscount] = useState(0)
  const [nameProduct, setNameProduct] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [colors, setColors] = useState<string[]>([]);
  const [material, setMaterial] = useState<string[]>([]);
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [length, setLength] = useState('')
  const [origin, setOrigin] = useState('')
  const [warranty, setWarranty] = useState('')
  const [careInstructions, setCareInstructions] = useState('')
  const [description, setDescription] = useState('')
  const [inventory, setInventory] = useState<number>(0)
  const [tags, setTags] = useState<string[]>([]);
  const [heft, setHeft] = useState<number>(0)
  const [selectCategory, setSelectCategory] = useState('')
  const [alertAddDone, setAlertAddDone] = useState(false)

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
  const isDataProductValid = () => {
    return (
      infoSeller?.data._id &&
      selectCategory &&
      nameProduct &&
      listImg.length > 0 &&
      price &&
      material &&
      careInstructions &&
      description &&
      inventory &&
      tags.length > 0 &&
      heft
    );
  };
 
  const addproduct = async () => {
    if (!isDataProductValid()) {
      alert("Vui lòng nhập đầy đủ thông tin sản phẩm.");
      return;
    }
    try {
      const uploadUrls = await Promise.all(
        listImg
          .filter((file): file is File => file !== null && file !== undefined)
          .map((file) => uploadImage(file))
      );
      const dataProduct = {
        seller_id: infoSeller?.data._id,
        category_id: selectCategory,
        name: nameProduct,
        img: uploadUrls,
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
      if (accessToken && isDataProductValid()) {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/add-product`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ dataProduct: dataProduct })
        })
        if (res.status === 200) {
          setNameProduct('')
          setListImg([])
          setDiscount(0)
          setPrice(0)
          setColors([])
          setMaterial([])
          setWeight('')
          setHeight('')
          setLength('')
          setOrigin('')
          setCareInstructions('')
          setDescription('')
          setInventory(0)
          setTags([])
          setHeft(0)
          setSelectCategory('')
          setWarranty('')
          setAlertAddDone(true)
          setTimeout(() => setAlertAddDone(false), 2000)
        }
      }

    } catch (error) {
      console.error("Lỗi upload ảnh hoặc thêm sản phẩm:", error);
    }
  };

  return (
    <div className="mb-28 2xl:p-10 2xl:mx-32 xl:mx-20 lg:mx-16 sm:mx-6 xl:p-4">
      <div className="flex justify-between">
        <p className="text-2xl font-medium">Thêm sản phẩm mới</p>
        <Button className=" bg-[var(--color-button)] hover:bg-[var(--color-hover-button)]" onClick={addproduct}><IoAddCircleOutline />Thêm sản phẩm</Button>
      </div>
      <div className="bg-white rounded-sm min-h-96 mt-4 p-10 shadow">
        <div className="grid grid-cols-6">
          <Label>Tên sản phẩm: *</Label>
          <Input className="col-span-2" onChange={(e) => setNameProduct(e.target.value)} />
        </div>
        <div className="grid grid-cols-6 mt-2">
          <Label>Thêm ảnh: *</Label>
          <div className="flex border rounded-sm items-center justify-center cursor-pointer col-span-2 h-full py-2">
            <IoAddCircleOutline
              onClick={handleAddLength}
              title="thêm ảnh"
            />
          </div>
          <p className="text-xs ml-4 h-full flex items-center">(Mỗi ô nhập chọn ảnh)</p>

        </div>
        {lengthArrayImg.map((item, idx) => (
          <div key={`img-add-${item}`} className="grid grid-cols-6 mt-2">
            <Label></Label>
            <Input type="file" accept="image/*" className="col-span-2" onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              handleChangeFile(idx, file);
            }} />
            <GrSubtractCircle
              onClick={() => handleSubtractionLength(idx)}
              className="h-full flex items-center ml-2 cursor-pointer"
              title="xóa ảnh"
            />
          </div>
        ))}
        <div className="grid grid-cols-6  py-4">
          <Label>Giảm giá: {discount} %</Label>
          <Slider defaultValue={[discount]} onValueChange={(value) => { setDiscount(value[0]) }} max={100} step={1} className="col-span-2" />
        </div>
        <div className="grid grid-cols-6">
          <Label>Giá bán: *</Label>
          <Input type="number" min={0} className="col-span-2" onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-6 mt-2">
          <Label>Màu sắc:</Label>
          <div className="flex border rounded-sm items-center justify-center cursor-pointer col-span-2 h-full py-2">
            <IoAddCircleOutline
              onClick={handleAddColor}
              className="cursor-pointer"
              title="Thêm màu"
            />
          </div>
          <p className="text-xs ml-4 h-full flex items-center">(Mỗi ô nhập một màu)</p>

        </div>
        {colors.map((color, index) => (
          <div className="grid grid-cols-6 mt-2" key={index}>
            <Label></Label>
            <Input
              className="col-span-2"
              value={color}
              onChange={(e) => handleChangeColor(index, e.target.value)}

            />
            <div className="flex items-center ml-2">
              <GrSubtractCircle
                onClick={() => handleRemoveColor(index)}
                className="cursor-pointer"
                title="Xóa màu"
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-6 mt-2">
          <Label>Vật liệu: *</Label>
          <div className="flex border rounded-sm items-center justify-center cursor-pointer col-span-2 h-full py-2">
            <IoAddCircleOutline
              onClick={handleAddMaterial}
              className="cursor-pointer"
              title="Thêm vật liệu"
            />
          </div>
          <p className="text-xs ml-4 h-full flex items-center">(Mỗi ô nhập một vật liệu)</p>

        </div>
        {material.map((material, index) => (
          <div className="grid grid-cols-6 mt-2" key={index}>
            <Label></Label>
            <Input
              className="col-span-2"
              value={material}
              onChange={(e) => handleChangeMaterial(index, e.target.value)}

            />
            <div className="flex items-center ml-2">
              <GrSubtractCircle
                onClick={() => handleRemoveMaterial(index)}
                className="cursor-pointer"
                title="Xóa vật liệu"
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-6 mt-2">
          <Label>Kích thước: (cm)</Label>
          <div className="mr-4">
            <Input className="" onChange={(e) => setLength(e.target.value)} />
          </div>
          <div className="mr-4">
            <Input className="" onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="mr-4">
            <Input className="" onChange={(e) => setHeight(e.target.value)} />
          </div>
          <p className="text-xs h-full flex items-center ">(Dài-Rộng-Cao)</p>
        </div>
        <div className="grid grid-cols-6 mt-2">
          <Label>Nguồn gốc: </Label>
          <Input className="col-span-2" onChange={(e) => setOrigin(e.target.value)} />
        </div>
        <div className="grid grid-cols-6 mt-2">
          <Label>Chính sách bảo hành: </Label>
          <Input className="col-span-2" onChange={(e) => setWarranty(e.target.value)} />
        </div>
        <div className="grid grid-cols-6 mt-2">
          <Label>Hướng dẫn bảo quản: *</Label>
          <Textarea className="col-span-4" onChange={(e) => setCareInstructions(e.target.value)} />
          <p className="text-xs flex items-center h-ful ml-1">(Nhớ chấm khi hết một ý)</p>
        </div>
        <div className="grid grid-cols-6 mt-2">
          <Label>Mô tả: *</Label>
          <Textarea className="col-span-4" onChange={(e) => setDescription(e.target.value)} />
          <p className="text-xs flex items-center h-ful ml-1">(Nhớ chấm khi hết một ý)</p>
        </div>
        <div className="grid grid-cols-6 mt-2">
          <Label>Hàng tồn kho: *</Label>
          <Input type="number" min={0} className="col-span-2" onChange={(e) => setInventory(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-6 mt-2">
          <Label>Thẻ tìm kiếm: *</Label>
          <div className="flex border rounded-sm items-center justify-center cursor-pointer col-span-2 h-full py-2">
            <IoAddCircleOutline
              onClick={handleAddTags}
              className="cursor-pointer"
              title="Thêm thẻ"
            />
          </div>
          <p className="text-xs ml-4 h-full flex items-center">(Mỗi ô nhập một thẻ tìm kiếm)</p>
        </div>
        {tags.map((tags, index) => (
          <div className="grid grid-cols-6 mt-2" key={index}>
            <Label></Label>
            <Input
              className="col-span-2"
              value={tags}
              onChange={(e) => handleChangeTags(index, e.target.value)}

            />
            <div className="flex items-center ml-2">
              <GrSubtractCircle
                onClick={() => handleRemoveTags(index)}
                className="cursor-pointer"
                title="Xóa thẻ"
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-6 mt-2">
          <Label>Trọng lượng: *</Label>
          <Input type="number" min={0} className="col-span-2" onChange={(e) => setHeft(Number(e.target.value))} />
          <p className="flex h-full items-center text-xs ml-2">(quy đổi theo gram)</p>
        </div>
        <div className="grid grid-cols-6 mt-2">
          <Label>Danh mục: * </Label>
          <Select onValueChange={setSelectCategory}>
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {listCategory?.data.map((value) => (
                <SelectItem key={value._id} value={value._id}>{value.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {alertAddDone &&
        <Alert className="absolute top-36 w-72 right-0 py-4 bg-green-200/30">
          <AlertDescription className="text-green-600/50 ">
            Thêm sản phẩm thành công!
          </AlertDescription>
        </Alert>
      }
    </div>
  );
}
