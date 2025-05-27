"use client";
import { useState } from "react";
import { InputOTPFormForget } from "./FormInputOtpFGP";
import { FormChangePassword } from "./change-password/FormChangePassword";
import { ForgetPassword } from "./ForgetPassword";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ForgetPass() {
  const [checkConfirmForget, setCheckConfirmForget] = useState(false);
  const [confirmToken, setConfirmToken] = useState("");
  const [checkFoget, setCheckForget] = useState(false);
  const route = useRouter();
  return (
    <div className="flex justify-center items-center h-full ">
      <div className="bg-white rounded-sm shadow-2xl px-16 py-20 my-24">
        <div className="2xl:w-80 ">
          <div className="text-3xl font-medium flex justify-center items-center mb-10">
            <p>Quên mật khẩu</p>
          </div>
          {!checkFoget ? (
            <ForgetPassword
              setConfirmToken={setConfirmToken}
              setCheckForget={setCheckForget}
            />
          ) : !checkConfirmForget ? (
            <InputOTPFormForget
              setCheckConfirmForget={setCheckConfirmForget}
              confirmToken={confirmToken}
            />
          ) : (
            <FormChangePassword confirmToken={confirmToken} />
          )}
          {!checkConfirmForget && !checkFoget && <p className="mt-2 text-sm"> Bạn chưa có tài khoản ?
            <Button
              onClick={() => route.push("/login")}
              className="font-medium bg-inherit hover:bg-inherit text-[var(--color-text-root)]  shadow-none pl-1 ">
              Đăng nhập ngay!
            </Button>
          </p>
          }
        </div>
      </div>
    </div>
  );
}
