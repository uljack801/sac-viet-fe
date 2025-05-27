import Otp from "@/app/config/models/Otp";
import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { otp } = await req.json();
  const authHeader = req.headers.get('authorization')

  try {
    const token = authHeader?.split(" ")[1]
    
    if(!token || !authHeader.startsWith("Bearer ")){
      return NextResponse.json({
        message: "Unauthorizaion!"
      }, {status: 401})
    }
    const decoded = jwt.verify(token, SECRET_KEY ) as {email: string}
    const exitedUser = await Otp.findOne({ email: decoded.email });

    if (!exitedUser) {
      return NextResponse.json(
        {
          message: "Email does not exist!",
        },
        { status: 400 }
      );
    }
    if (exitedUser.otp !== otp) {
      return NextResponse.json(
        {
          message: "Invalid OTP. Please try again!",
        },
        { status: 400 }
      );
    }
    await Otp.findOneAndDelete({ email: decoded.email  });

    return NextResponse.json(
      {
        message: "OTP verification successful!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error. Please try again later!",
      },
      { status: 500 }
    );
  }
}
