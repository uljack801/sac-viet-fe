import * as dotenv from "dotenv";
import User from "@/app/config/models/User";
import Otp from "@/app/config/models/Otp";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { generateOtp } from "@/app/utils/createOtp";
import sendEmail from "@/app/utils/sendEmail";
import { SECRET_KEY } from "@/app/helper/constant";
dotenv.config();

export async function POST(req: NextRequest) {
  await connectDB();
  const otp = generateOtp();
  const { account, password, email } = await req.json();
  try {
    const existingAccount = await User.findOne({ account});
    const existingEmail = await User.findOne({ email});
    
    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already exists!" },
        { status: 400 }
      );
    }
    if (existingAccount) {
      return NextResponse.json(
        { message: "Account already exists!" },
        { status: 401 }
      );
    }
    const confirm_access = jwt.sign({ account, email }, SECRET_KEY, {
      expiresIn: "5m",
    });
    await Otp.create({
      email,
      otp,
      accessTokenRegis: confirm_access,
    });
    await User.create({
      account,
      password,
      email,
      authenticated: false,
      authenticationExpiresAt: new Date(Date.now() +  5 * 60 * 1000)
    });
    await sendEmail(
      email,
      "Xác nhận đăng ký ",
      `Chào bạn đến với Sắc Việt! Đây là email xác nhận. Vui lòng không chia sẻ OTP với bất kì ai. Mã OTP của bạn là: ${otp}`
    );
    const response = NextResponse.json(
      {
        confirm_access,
        message: "Success",
      },
      { status: 200 }
    );
    response.headers.append(
      "Set-Cookie",
      `confirm_access=${confirm_access}; Path=/; HttpOnly; SameSite=Lax; Max-Age=300`
    );
    return response;
  } catch (error) {
    console.error(error);
     await User.findByIdAndDelete({ email });
    return NextResponse.json(
      {
        message: "An error occurred, please try again later!",
      },
      { status: 500 }
    );
  }
}
