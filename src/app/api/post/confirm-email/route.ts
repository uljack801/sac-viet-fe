import Otp from "@/app/config/models/Otp";
import jwt from "jsonwebtoken";
import User from "@/app/config/models/User";
import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";
import Cart from "@/app/config/models/Cart";
import UserAddress from "@/app/config/models/UserAddress";
import Order from "@/app/config/models/Order";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return NextResponse.json(
      { message: "Unauthorized access!" },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, SECRET_KEY) as {
    email: string;
    account: string;
  };
  if (!decoded) {
    return NextResponse.json(
      { message: "Unauthorized access!" },
      { status: 401 }
    );
  }
  try {
    const { otp } = await req.json();
    const checkUserConfirm = await Otp.findOne({ email: decoded.email });
    if (!checkUserConfirm) {
      return NextResponse.json(
        { message: "Invalid or expired OTP!" },
        { status: 400 }
      );
    }
    if (checkUserConfirm.otp !== otp) {
      return NextResponse.json({ message: "Incorrect OTP!" }, { status: 400 });
    }
    const findUser = await User.findOne({ email: decoded.email });
    if (!findUser) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }
    const id = findUser._id;
    const access_token = jwt.sign(
      { id, account: decoded.account, email: decoded.email },
      SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { id, account: decoded.account, email: decoded.email },
      SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    const card = await Cart.create({
      user: id,
    });
    const userAddress = await UserAddress.create({
      user: id,
    });
    const order = await Order.create({
      user: id,
    });
    findUser.card = card._id;
    findUser.user_address = userAddress._id;
    findUser.ordered = order._id;

    findUser.token = refreshToken;
    findUser.authenticated = true;
    findUser.authenticationExpiresAt = null;
    await findUser.save();
    await Otp.findOneAndDelete({ email: decoded.email });
    const response = NextResponse.json(
      { access_token, message: "OTP verification successful!" },
      { status: 200 }
    );
    response.headers.append(
      "Set-Cookie",
      `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    return response;
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    await Otp.findOneAndDelete({ email: decoded.email });
    await User.findOneAndDelete({ email: decoded.email });
    return NextResponse.json(
      { message: "An error occurred!" },
      { status: 500 }
    );
  }
}
