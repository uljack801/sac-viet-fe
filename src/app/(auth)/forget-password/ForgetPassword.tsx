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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { fetchForgetPassword } from "./fetchForgetPassword"
import { useState } from "react"

const FormSchema = z.object({
  email: z.string().email("Email không hợp lệ!"),
})

export function ForgetPassword({setConfirmToken, setCheckForget} : {setConfirmToken: React.Dispatch<React.SetStateAction<string>>, setCheckForget: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [messageFG, setMessageFG] = useState('')
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await fetchForgetPassword(data);    
    if(res?.status === 200){
      setConfirmToken(res.accessToken.confirm_access)
      setCheckForget(true)
    }else if(res?.status === 400){
      setMessageFG("Email không tồn tại!")
      setTimeout(() => setMessageFG(""),1000 )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Nhập địa chỉ email" {...field} />
              </FormControl>
              <div className="h-1">
              <FormMessage />
              </div>
              <div className="h-1">
              <p className="text-red-500 text-xs">
              {messageFG}
              </p>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-[#C95050] text-white w-full mt-6 h-10 hover:bg-[#C95040]">Tiếp theo</Button>
      </form>
    </Form>
  )
}

