"use client";
import { LoginForm } from "./LoginForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Login() {
  const route = useRouter();
  const [forgetPass, setForgetPass] = useState(false);
  const handleForgetPassword = () => {
    setForgetPass(true)
    route.push('/forget-password')
  }
  return (
    <div className="flex justify-center items-center  h-full">
      <div className="bg-white rounded-sm shadow-2xl p-20 my-2">
        <div className="2xl:w-80  ">
          <div className="text-3xl font-medium flex justify-center items-center mb-10">
            {!forgetPass ? <p>Đăng nhập</p> : <p>Quên mật khẩu</p>}
          </div>
          <LoginForm />
          {!forgetPass && <p className="mt-10 text-sm font-medium cursor-pointer" onClick={() => handleForgetPassword()}>Quên mật khẩu!</p>}
          {forgetPass && <p className="mt-2 text-sm cursor-pointer font-medium" onClick={() => setForgetPass(false)}>Đăng nhập ngay!</p>}
          <p className="mt-2 text-sm"> Bạn chưa có tài khoản ?
            <Button
              onClick={() => route.push("/register")}
              className="font-medium bg-inherit hover:bg-inherit text-[var(--color-text-root)] shadow-none pl-1 ">
              Đăng ký ngay !
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
