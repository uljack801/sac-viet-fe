"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NEXT_PUBLIC_LOCAL, phoneRegex } from "@/app/helper/constant"
import { useAuth } from "@/app/AuthContext"
import React, { useState } from "react"
import { ShowAlert } from "@/app/helper/ShowAlert"

const FormSchema = z.object({
  detail: z.string().min(1),
  phone: z.string().regex(
    phoneRegex, "Số điện thoại không hợp lệ"
  ),
  name: z.string().min(1),
})

export function InputFormDetail({ valueCommune, setOpen}: { valueCommune: string , setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { accessToken, setDataUser } = useAuth();
  const [showAlert, setShowAlert] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      detail: "",
      phone: "",
      name:"",
    },
  })
  
  async function onSubmit(data: z.infer<typeof FormSchema>) {

    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-address`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        address: data.detail + ", " + valueCommune,
        phone: data.phone,
        name: data.name
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      setDataUser(data);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false)
        setOpen(false)
      }, 2000)  
    }
  }
  
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >
          <FormField
            control={form.control}
            name="detail"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Địa chỉ chi tiết</FormLabel>
                <FormControl>
                  <Input placeholder="nhập địa chỉ chi tiết" {...field} disabled={valueCommune === ''} />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2 w-1/2 mr-10">
                <FormLabel>Tên người nhận</FormLabel>
                <FormControl>
                  <Input placeholder="nhập tên người nhận" {...field} disabled={valueCommune === ''} />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="mt-2 w-1/2">
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="nhập số điện thoại" {...field} disabled={valueCommune === ''} />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-[#C95050] text-white hover:bg-[#c9505098] mt-10" disabled={valueCommune === ''}>Lưu</Button>
          </div>
          {showAlert && ShowAlert("Cập nhập thành công!")
            }
        </form>
      </Form>
    </div>
  )
}
