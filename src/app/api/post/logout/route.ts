import User from "@/app/config/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, SECRET_KEY) as {
      email: string;
      account: string;
    };

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const email = decoded.email;
    const existed = await User.findOne({ email });

    if (!existed) {
      return NextResponse.json(
        { message: "Account not found!" },
        { status: 404 }
      );
    }
    existed.token = "";
    await existed.save();
    const response = NextResponse.json(
      {
        message: "Logged out successfully!",
      },
      { status: 200 }
    );

    response.headers.append(
      "Set-Cookie",
      `refreshToken=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
