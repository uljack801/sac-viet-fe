"use client"
import { useEffect, useState } from "react";
import { FormCapital } from "./address/FormCapital";
import { FormDistrict } from "./address/FormDistrict";
import { FormCommune } from "./address/FormCommune";
import { InputFormDetail } from "./address/FormDetail";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function FormUpdateAddress() {
  const [valueCapital, setValueCapital] = useState('')
  const [checkCapital, setCheckCapital] = useState(false)
  const [valueDistrict, setValueDistrict] = useState('')
  const [checkDistrict, setCheckDistrict] = useState(false)
  const [valueCommune, setValueCommune] = useState('')
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (valueCapital !== '') {
      setCheckCapital(true)
    }
    if (valueDistrict !== '' && valueCapital !== '') {
      setCheckDistrict(true)
    }
  }, [valueCapital, valueDistrict])
  
  useEffect(() => {
    if(valueCommune !== '' && open === false){
      setValueCapital('')
      setValueDistrict('')
      setValueCommune('')
    }
  }, [open, valueCommune])
  return (
      <Dialog  open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild >
          <Button variant="outline" className="bg-[var(--color-button)] text-white hover:bg-[var(--color-hover-button)] hover:text-white">Thêm mới</Button>
        </DialogTrigger>
        <DialogContent className="p-10 max-sm:p-4 max-sm:mt-12">
          <DialogHeader>
            <DialogTitle className="max-lg:text-2xl font-medium max-sm:m-0 max-sm:text-xl">Cập nhật địa chỉ nhận hàng</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex max-sm:flex-col max-sm:gap-2 max-lg:flex max-lg:flex-col max-lg:gap-2 max-xl:flex max-xl:flex-col flex-col gap-4 max-xl:gap-4 ">
            <FormCapital setValueCapital={setValueCapital} />
            <FormDistrict setValueDistrict={setValueDistrict} valueCapital={valueCapital} checkCapital={checkCapital} />
            <FormCommune checkDistrict={checkDistrict} setValueCommnune={setValueCommune} valueDistrict={valueDistrict} />
            <InputFormDetail valueCommune={valueCommune} setOpen={setOpen}/>
          </div>
        </DialogContent>
      </Dialog> 
  );
}
