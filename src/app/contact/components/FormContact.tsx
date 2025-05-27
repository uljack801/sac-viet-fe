"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FetchPostContact } from "./FetchPostContact"
import { phoneRegex } from "@/app/helper/constant"
import { useState } from "react"
import { ShowAlert } from "@/app/helper/ShowAlert"


const FormSchema = z.object({
  username: z.string().min(2, 'Tên ít nhất phải 2 ký tự!'),
  accountEmail: z.string().toLowerCase().trim().email("Email không hợp lệ!"),
  phone: z.string().trim().regex(phoneRegex, 'Số điện thoại không hợp lệ!'),
  message: z.string()
})


export function FormContact() {
  const [checkSendContact, setCheckSendContant] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      accountEmail: "",
      phone: '',
      message: ''
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await FetchPostContact(data);
    if(res?.status === 200){
      setCheckSendContant(true);
      setTimeout(()=> setCheckSendContant(false), 2000)
      form.reset({
        username: "",
        accountEmail: "",
        phone: "",
        message: ""
      });
      
    }
  }

  return (
    <div className="h-full flex items-center justify-center py-14">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="" >
          <div className=" grid grid-cols-12">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="col-span-4 ">
                  <FormControl>
                    <Input placeholder="Tên của bạn *" {...field} />
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountEmail"
              render={({ field }) => (
                <FormItem className="col-span-4 mx-2">
                  <FormControl>
                    <Input placeholder="Tài khoản email *" {...field} />
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormControl>
                    <Input placeholder="Số điện thoai *" {...field} />
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>            
                </FormItem>
              )}
            />
          </div>
          <div className="mt-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem >
                  <FormControl>
                    <Textarea
                      placeholder="Lời nhắn của bạn"
                      className="resize-none h-60"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-[#C95050] text-sm text-white mt-6 hover:bg-[var(--color-hover-button)]">Gửi tin nhắn</Button>
          </div>
          {checkSendContact && ShowAlert('Gửi lời nhắn thành công!')}
        </form>
      </Form>
    </div>
  )
}
