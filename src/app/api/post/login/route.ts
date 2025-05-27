import User from "@/app/config/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        {
          message: "Missing username or password",
        },
        { status: 400 }
      );
    }
    const checkUser = await User.findOne({ account: username });
    if (!checkUser) {
      return NextResponse.json(
        { message: "Invalid credentials!" },
        { status: 404  }
      );
    }
    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials!" },
        { status: 401 }
      );
    }
    const refreshToken = jwt.sign(
      { id: checkUser._id, account: checkUser.account, email: checkUser.email, role: checkUser.role },
      SECRET_KEY,
      { expiresIn: "7d" }
    );
    const access_token = jwt.sign(
      { id: checkUser._id, account: checkUser.account, email: checkUser.email,  role: checkUser.role },
      SECRET_KEY,
      { expiresIn: "15m" }
    );
    await User.findByIdAndUpdate(checkUser._id, { token: refreshToken });

    const response = NextResponse.json(
      {
        access_token,
        message: "Login success!",
      },
      { status: 200 }
    );
    response.headers.append(
      "Set-Cookie",
      `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
