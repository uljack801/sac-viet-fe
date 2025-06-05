import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Conversation from "@/app/config/models/Conversation";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY as string) as {
      id: string;
      email: string;
      account: string;
    };

    if (!decoded) {
      return NextResponse.json(
        { message: "Không tìm thấy thông tin!" },
        { status: 404 }
      );
    }
    const { postID, name , comment } = await req.json();
    const UpdateConversation = await Conversation.findById({ _id: postID });

    if (!UpdateConversation) {
      return NextResponse.json(
        { message: "Không tìm thấy thông tin !" },
        { status: 404 }
      );
    }
    UpdateConversation.comments.push({
        user: decoded.id,
        name: name ,
        comment: comment
    })
    await UpdateConversation.save();
    return NextResponse.json({ message: "Cập nhật thành công!" });
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
