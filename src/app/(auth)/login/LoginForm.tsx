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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchLogin } from "./fetchLogin";
import { useAuth } from "@/app/AuthContext";
import { ShowPassword } from "@/app/helper/ShowPassword";


const FormSchema = z.object({
  username: z.string().toLowerCase().trim().refine(val => /^[a-zA-Z0-9_]+$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Tài khoản phải là username (chỉ chữ, số, dấu _) hoặc email hợp lệ!",
  }),
  password: z.string().regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, "Mật khẩu không chứa khoảng trắng hoặc ký tự có dấu!"),
});

export function LoginForm() {
  const router = useRouter();
  const { setAccessToken } = useAuth();
  const [messagePassword, setMessagePassword] = useState("");
  const [messageAccount, setMessageAccount] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWait, setIsWait] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (isWait) return
      setIsWait(true);
      const res = await fetchLogin({ password: data.password, username: data.username })
      if (res.status === 200 && res.data?.access_token) {
        setAccessToken(res.data?.access_token);
        router.push("/");
        router.refresh();
      } else if (res.status === 401) {
        setMessagePassword("Mật khẩu không đúng!");
      } else if (res.status === 404) {
        setMessageAccount("Tài khoảng không đúng hoặc không tồn tại!");
      }
      setTimeout(() => {
        setMessageAccount("");
        setMessagePassword("");
      }, 2000);
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setIsWait(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Tài khoản/Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tài khoản"
                  {...field}
                  className="h-10"
                  autoComplete="username"
                />
              </FormControl>
              <div className="h-1">
                <p className="text-red-500 text-xs absolute -bottom-3">
                  {messageAccount}
                </p>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-4 relative">
              <FormLabel>Mật khẩu</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Mật khẩu"
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
                <p className="text-red-500 text-xs absolute -bottom-3">
                  {messagePassword}
                </p>
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-[#C95050] text-white w-full mt-6 h-12 hover:bg-[#C95040]"
        >
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
