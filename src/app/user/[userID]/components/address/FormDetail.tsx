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
import React, { useEffect } from "react"

const FormSchema = z.object({
  detail: z.string().min(1, 'Vui lòng nhập dữ liệu'),
  phone: z.string().regex(
    phoneRegex, "Số điện thoại không hợp lệ"
  ),
  name: z.string().min(1, 'Vui lòng nhập dữ liệu'),
})

export function InputFormDetail({ valueCommune, setOpen }: { valueCommune: string, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { accessToken, setDataUser } = useAuth();

  console.log(valueCommune);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      detail: "",
      phone: "",
      name: "",
    },
  })

  useEffect(() => {
  if (valueCommune !== '') {
    form.reset({
      detail: "",
      phone: "",
      name: "",
    });
  }
}, [form, valueCommune]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-address`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        address: data.detail + ", " + valueCommune,
        commune: valueCommune.split(',')[0],
        district: valueCommune.split(',')[1],
        capital: valueCommune.split(',')[2],
        deatails: data.detail,
        phone: data.phone,
        name: data.name
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      setDataUser(data);
      setTimeout(() => {
        setOpen(false)
      }, 1000)
    }
  }

  return (
    <div className="w-full z-10">
      {valueCommune !== '' &&
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <FormControl>
                    <Input placeholder="nhập địa chỉ chi tiết"  {...field}/>
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between max-sm:flex-col">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-2 w-1/2  max-sm:w-full mr-10">
                    <FormLabel>Tên người nhận</FormLabel>
                    <FormControl>
                      <Input placeholder="nhập tên người nhận" {...field} />
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
                render={( { field }) => (
                  <FormItem className="mt-2 w-1/2 max-sm:w-full">
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="nhập số điện thoại" {...field} />
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
          </form>
        </Form>
      }

    </div>
  )
}
