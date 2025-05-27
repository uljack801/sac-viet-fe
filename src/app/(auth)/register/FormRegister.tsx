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
import { fetchPostRegister } from "./fetchPostRegister";
import { useState } from "react";
import { ShowPassword } from "@/app/helper/ShowPassword";

const FormSchema = z
  .object({
    username: z.string().min(2, "Tài khoản phải nhiều hơn 2 kí tự!"),
    email: z.string().trim().email(),
    password: z.string().min(6, "Mật khẩu ít nhất 6 kí tự!"),
    againPassword: z.string().min(6, "Mật khẩu ít nhất 6 kí tự!"),
  })
  .refine((data) => data.password === data.againPassword, {
    message: "Mật khẩu nhập lại không khớp!",
    path: ["againPassword"],
  });

export function RegisterForm({
  setCheckRegistor,
  setConfiremAccess,
}: {
  setCheckRegistor: React.Dispatch<React.SetStateAction<boolean>>;
  setConfiremAccess: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [messageEmail, setMessageEmail] = useState("");
  const [messageAccount, setMessageAccount] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      againPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await fetchPostRegister(data);
    if (response.status === 200) {
      setConfiremAccess(response.data?.confirm_access);
      setCheckRegistor(true);
    } else if (response.status === 400) {
      setMessageEmail("Email đã tồn tại.Vui lòng nhập lại!");
    } else if (response.status === 401) {
      setMessageAccount("Tài khoản đã tồn tại.Vui lòng nhập lại!");
    }
    setTimeout(() => {
      setMessageAccount("");
      setMessageEmail("");
    }, 2000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Tài khoản</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tài khoản"
                  {...field}
                  className="h-10  "
                />
              </FormControl>
              <FormMessage className="absolute -bottom-4" />
              <p className="text-red-500 text-xs absolute -bottom-4">
                {messageAccount}
              </p>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="my-5 relative">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  className="h-10"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage className="absolute -bottom-4" />
              <p className="text-red-500 text-xs absolute -bottom-4">
                {messageEmail}
              </p>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Mật khẩu"
                    type={!showPassword ? "password" : "text"}
                    {...field}
                    className="h-10"
                    autoComplete="new-password"
                  />
                </FormControl>
                <ShowPassword
                  setShowPassword={setShowPassword}
                  showPassword={showPassword}
                />
              </div>
              <div className="h-1">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="againPassword"
          render={({ field }) => (
            <FormItem className="mt-5">
              <FormLabel>Nhập lại mật khẩu</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Nhập lại mật khẩu"
                    type={!showPassword ? "password" : "text"}
                    {...field}
                    className="h-10"
                    autoComplete="current-password"
                  />
                </FormControl>
                <ShowPassword
                  setShowPassword={setShowPassword}
                  showPassword={showPassword}
                />
              </div>
              <div className="h-1">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-[#C95050] text-white w-full mt-6 h-12 hover:bg-[#C95040]"
        >
          Đăng ký
        </Button>
      </form>
    </Form>
  );
}
