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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FetchPostSubscript } from "./FetchPostSubscribe"
import { useState } from "react"
import { ShowAlert } from "@/app/helper/ShowAlert"

const FormSchema = z.object({
  inputEmail: z.string().toLowerCase().trim().email("Email không hợp lệ!!")
})

export function SubscribeEmail() {
  const [showAlert, setShowAlert] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      inputEmail: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await FetchPostSubscript({ data })
    if (res === 200) {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 2000)
      form.reset({
        inputEmail: "",
      })
    }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-72 2xl:w-60 relative">
        <FormField
          control={form.control}
          name="inputEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl className="relative ">
                <Input placeholder="Đăng ký ngay" {...field} className="bg-white" />
              </FormControl>
              <div className="h-2">
                <FormMessage />
              </div>
              <FormDescription className="xl:text-xs">
                Chúng tôi sẽ gửi cập nhật những tin khuyến mãi & báo giá mới nhất đến bạn!
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" className="text-white absolute top-0 right-0 bg-[var(--color-button)] hover:bg-[var(--color-hover-button)] mt-2">Đăng ký</Button>
      </form>
      {showAlert && ShowAlert('Đăng ký thành công!')}

    </Form>
  )
}
