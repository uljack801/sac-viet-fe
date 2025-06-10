"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { useAuth } from "@/app/AuthContext";
import { useState } from "react";
import { ShowPassword } from "@/app/helper/ShowPassword";
import { ShowAlert } from "@/app/helper/ShowAlert";

const FormSchema = z
  .object({
    password: z.string(),
    newPassword: z.string().min(6, 'mật khẩu phải dài 6 ký tự trở lên.'),
    newPasswordAgain: z.string().min(6, 'mật khẩu phải dài 6 ký tự trở lên.'),
  })
  .refine((data) => data.newPassword === data.newPasswordAgain, {
    message: "Mật khẩu nhập lại không khớp!",
    path: ["againPassword"],
  });

export function InputFormChangePass() {
  const { accessToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordOLD, setShowPasswordOLD] = useState(false);
  const [showPasswordNew, setShowPassworNew] = useState(false);
  const [showMess, setShowMess] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isWait, setIsWait] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      newPasswordAgain: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (isWait) return
      setIsWait(true)
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          password: data.password,
          newPassword: data.newPassword,
        }),
      });
      if (res.status === 401) {
        setShowMess("Mật khẩu cũ không đúng!");
      } else if (res.status === 200) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      } else {
        setShowMess("Lỗi hệ thống!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsWait(false)
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center max-sm:p-10 max-lg:p-10 max-xl:p-20 max-2xl:p-20 p-20">
      <p className="text-xl mb-10 font-medium">Thay đổi mật khẩu</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu cũ</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={!showPasswordOLD ? "password" : "text"}
                      placeholder="mật khẩu cũ"
                      autoComplete="old-password"

                      {...field}
                    />
                  </FormControl>
                  <ShowPassword
                    setShowPassword={setShowPasswordOLD}
                    showPassword={showPasswordOLD}
                  />
                </div>
                <div className="h-2 mb-2">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={!showPassword ? "password" : "text"}
                      placeholder="nhập mật khẩu mới"
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <ShowPassword
                    setShowPassword={setShowPassword}
                    showPassword={showPassword}
                  />
                </div>
                <div className="h-2 mb-2">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPasswordAgain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={!showPasswordNew ? "password" : "text"}
                      placeholder="nhập lại mật khẩu"
                      autoComplete="new-password-again"
                      {...field}
                    />
                  </FormControl>
                  <ShowPassword
                    setShowPassword={setShowPassworNew}
                    showPassword={showPasswordNew}
                  />
                </div>
                <div className="h-2">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <p className="text-red-500 text-xs h-5 m-0">{showMess}</p>
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              className="bg-[var(--color-button)] hover:bg-[var(--color-hover-button)"
            >
              Thay đổi
            </Button>
          </div>
          {showAlert && ShowAlert("Đổi mật khẩu thành công!")}
        </form>
      </Form>
    </div>
  );
}
