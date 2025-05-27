import Otp from "@/app/config/models/Otp";
import User from "@/app/config/models/User";
import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return NextResponse.json(
        { message: "Unauthorization!" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token , SECRET_KEY) as {email: string , account: string}
    const findUser = await User.findOneAndDelete({
      email: decoded.email,
      account: decoded.email,
      authenticated: false,
    });
    const findUserOTP = await Otp.findOneAndDelete({ email: decoded.email });

    if (!findUser && !findUserOTP) {
      return NextResponse.json({ message: "NotFound !" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "Delete Success!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error",
      },
      { status: 500, statusText: "Error!!" }
    );
  }
}
