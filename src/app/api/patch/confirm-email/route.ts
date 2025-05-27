import Otp from "@/app/config/models/Otp";
import { generateOtp } from "@/app/utils/createOtp";
import sendEmail from "@/app/utils/sendEmail";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@/app/helper/constant";
export async function PATCH(req: NextRequest) {
  const otp = generateOtp();
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as {
      email: string;
      account: string;
    };
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
    }
    const findUser = await Otp.findOne({ email: decoded.email });
    if (!findUser) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    findUser.otp = otp;
    findUser.createdAt = Date.now();
    await findUser.save();

    await sendEmail(
      decoded.email,
      "Xác nhận đăng ký ",
      `Chào bạn đến với Sắc Việt ! Đây là email xác nhận. Vui lòng không chia sẻ OTP với bất kì ai. Mã OTP của bạn là:  ${otp}`
    );

    return NextResponse.json(
      {
        message: "Send OTP again success!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
