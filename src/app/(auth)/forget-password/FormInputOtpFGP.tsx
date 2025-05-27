"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TbXboxXFilled } from "react-icons/tb";
import { fetchConfirmForPass } from "./fetchConfirmForPass";
import { fetchResendOTP } from "../register/confirm-email/fetchResendOTP";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function InputOTPFormForget({ setCheckConfirmForget, confirmToken }: { setCheckConfirmForget: React.Dispatch<React.SetStateAction<boolean>>, confirmToken: string }) {
  const route = useRouter();
  const [counter, setCounter] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [checkSatusOtp, setCheckSatusOtp] = useState(false);
  const [messageOTP, setMessageOTP] = useState("");

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [counter]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      controller.abort();
      setCheckSatusOtp(true);
    }, 300000);

    try {
      if (confirmToken) {
        const res = await fetchConfirmForPass({ data, confirmToken, controller });
        if (res === 200) {
          clearTimeout(timeoutId);
          setCheckConfirmForget(true);
        } else if (res === 400) {
          setMessageOTP("OTP không đúng!");
        }
      }
    } catch (error) {
      console.error("Lỗi xác nhận email:", error);
    }
  }

  const handleResendOtp = async () => {
    setCounter(60);
    setIsResendDisabled(true);
    await fetchResendOTP(confirmToken);
  };
  return (
    <div className="flex items-center justify-center w-full">
      {!checkSatusOtp ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center relative">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <p className="text-red-500 text-xs absolute -bottom-5">
                    {messageOTP}
                  </p>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="w-2/3 bg-[#c95050] hover:bg-[#e79292e5] mt-6"
              >
                Xác nhận
              </Button>
            </div>
            <div className="text-sm mt-10">
              {counter > 0 ? (
                <p>
                  Chưa nhận được mã? Vui lòng chờ
                  <span className="font-bold ml-1">{counter}s</span>
                </p>
              ) : (
                <div>
                  <span className="text-black">Chưa nhận được mã? </span>
                  <button
                    onClick={handleResendOtp}
                    className="text-blue-500 hover:underline text-sm"
                    disabled={isResendDisabled}
                  >
                    Gửi lại OTP
                  </button>
                </div>
              )}
            </div>
          </form>
        </Form>
      ) : (
        <div className="flex justify-between flex-col items-center">
          <TbXboxXFilled className="text-9xl text-red-700/80" />
          <p className="text-red-700/80 text-sm">Xác nhận OTP thất bại!</p>
          <Button
            className="mt-4 bg-[#c95050] hover:bg-[#dc7a7a]"
            onClick={() => route.push("/register")}
          >
            Quay Lại
          </Button>
        </div>
      )}
    </div>
  );
}
