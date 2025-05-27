import Otp from "@/app/config/models/Otp";
import User from "@/app/config/models/User";
import { connectDB } from "@/app/config/mongoose";
import { generateOtp } from "@/app/utils/createOtp";
import sendEmail from "@/app/utils/sendEmail";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@/app/helper/constant";

export async function POST(req: NextRequest) {
  await connectDB();
  const otp = generateOtp();

  try {
    const { email } = await req.json();

    const exitedUser = await User.findOne({ email });
    if (!exitedUser) {
      return NextResponse.json(
        {
          message: "Email does not exist!",
        },
        { status: 400 }
      );
    }
    await Otp.findOneAndDelete({ email });
    const sendOtp = new Otp({ email: email, otp: otp });
    await sendOtp.save();
    const confirm_access = jwt.sign({ email }, SECRET_KEY, {
      expiresIn: "5m",
    });
    await sendEmail(
      email,
      "OTP xác nhận ",
      `Chào bạn đến với Sắc Việt ! Đây là email xác nhận otp cho password. Vui lòng không chia sẻ OTP với bất kì ai. Mã OTP của bạn là:  ${otp}`
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
    return NextResponse.json(
      {
        message: "Internal Server Error. Please try again later!",
      },
      { status: 500 }
    );
  }
}
