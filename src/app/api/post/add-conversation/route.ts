import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Conversation from "@/app/config/models/Conversation";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized access!" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: string;
      email: string;
      account: string;
    };
    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized access!" },
        { status: 401 }
      );
    }
    const find = await Conversation.find();
    if (!find) {
      return NextResponse.json(
        { message: "Unauthorized access!" },
        { status: 401 }
      );
    }

    const { image, content, name } = await req.json();

    const newConversation = new Conversation({
      user: decoded.id,
      image,
      content,
      name,
    });
    await newConversation.save();

    return NextResponse.json({ message: "Success!" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    return NextResponse.json(
      { message: "An error occurred!" },
      { status: 500 }
    );
  }
}
