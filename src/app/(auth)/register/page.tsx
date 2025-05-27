"use client";
import { useState } from "react";
import { RegisterForm } from "./FormRegister";

import { InputOTPForm } from "./confirm-email/FormInputOtp";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Register() {
  const route = useRouter();
  const [checkRegister, setCheckRegistor] = useState(false);
  const [confirmAccess, setConfiremAccess] = useState<string | undefined>("");
  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-white rounded-sm shadow-2xl px-20 py-10">
        <div className="2xl:w-80 ">
          <div className="text-3xl font-medium flex justify-center items-center mb-10">
            <p>Đăng ký tài khoản</p>
          </div>
          {!checkRegister ? (
            <RegisterForm
              setCheckRegistor={setCheckRegistor}
              setConfiremAccess={setConfiremAccess}
            />
          ) : (
            <InputOTPForm confirmAccess={confirmAccess} />
          )}
          {!checkRegister && (
            <p className="mt-2 text-sm">
              Bạn đã có tài khoản ?
              <Button
                onClick={() => route.push("/login")}
                className="font-medium bg-inherit hover:bg-inherit text-[var(--color-text-root)]  shadow-none pl-1 "
              >
                Đăng nhập ngay !
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
