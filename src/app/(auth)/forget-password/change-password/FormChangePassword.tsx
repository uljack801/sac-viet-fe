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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShowPassword } from "@/app/helper/ShowPassword";
import { fetchChangePassword } from "./fetchChangePassword";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react";

const FormSchema = z
  .object({
    newPassword: z.string().min(6, "Mật khẩu phải dài hơn 6 ký tự!"),
    newPasswordAgain: z.string().min(6, "Mật khẩu phải dài hơn 6 ký tự!"),
  }).refine((data) => data.newPassword === data.newPasswordAgain, {
    message: "Mật khẩu nhập lại không khớp!",
    path: ["againPassword"],
  });

export function FormChangePassword({ confirmToken }: { confirmToken: string }) {
  const route = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [checkForget, setCheckForget] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      newPasswordAgain: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await fetchChangePassword({ newPassword: data.newPassword, confirmToken })
    if (res === 200) {
      route.push("/login");
      setCheckForget(true)
      setTimeout(() => setCheckForget(false), 2000);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
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
                      autoComplete="new-password-1"
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
            name="newPasswordAgain"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={!showPassword ? "password" : "text"}
                      placeholder="nhập lại mật khẩu mới"
                      {...field}
                      autoComplete="new-again-password-1"
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
            className="flex justify-center w-full py-4 bg-[#c95050] hover:bg-[#e79292e5] mt-6"
          >
            Thay đổi
          </Button>
        </form>
      </Form>
      {checkForget && <Alert className="absolute top-1/5 right-0 w-auto px-10 mr-1 bg-green-200/30 text-green-400/65 border-0">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Lấy lại mật khẩu thành công!</AlertTitle>
        <AlertDescription>
        </AlertDescription>
      </Alert>
      }
    </div>
  );
}
