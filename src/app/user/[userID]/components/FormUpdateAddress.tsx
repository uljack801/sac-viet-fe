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
  
  return (
    <div >
      <div>
      <Dialog  open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-[var(--color-button)] text-white hover:bg-[var(--color-hover-button)] hover:text-white">Cập nhật</Button>
        </DialogTrigger>
        <DialogContent className="p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl mb-10 font-medium">Cập nhật địa chỉ nhận hàng</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex">
            <FormCapital setValueCapital={setValueCapital} />
            <FormDistrict setValueDistrict={setValueDistrict} valueCapital={valueCapital} checkCapital={checkCapital} />
            <FormCommune checkDistrict={checkDistrict} setValueCommnune={setValueCommune} valueDistrict={valueDistrict} />
          </div>
          <InputFormDetail valueCommune={valueCommune} setOpen={setOpen}/>
        </DialogContent>
      </Dialog> 
      </div>
    </div>
  );
}
