import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Conversation from "@/app/config/models/Conversation";

export async function PATCH(req: NextRequest) {
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

    const { postID, commentID } = await req.json();
    const findPost: ConversationObject | null = await Conversation.findById(
      postID
    );
    if (!findPost) {
      return NextResponse.json({ message: "Không tìm thấy comment!" });
    }
    findPost.comments.map((value) => {
      if (value._id.toString() === commentID) {
        value.likes.map(async (user) => {
          if (user.user.toString() === decoded.id) {
            await Conversation.updateOne(
              { _id: postID, "comments._id": commentID },
              { $pull: { "comments.$.likes": { user: decoded.id } } }
            );
          }
        });
      }
    });
    await Conversation.updateOne(
      { _id: postID, "comments._id": commentID },
      { $push: { "comments.$.likes": { user: decoded.id } } }
    );
    return NextResponse.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export type ConversationObject = {
  _id: string;
  user: string;
  name: string;
  image: [string];
  content: string;
  likes: [
    {
      user: string;
    }
  ];
  comments: [
    {
      _id: string;
      user: string;
      name: string;
      comment: string;
      image: [string];
      createdAt: Date;
      status: boolean;
      likes: [
        {
          user: string;
        }
      ];
      isEdit: boolean;
      reply: [
        {
          _id: string;
          user: string;
          name: string;
          comment: string;
          image: [string];
          createdAt: Date;
          likes: [
            {
              user: string;
            }
          ];
          status: boolean;
          isEdit: boolean;
        }
      ];
    }
  ];
  isEdit: boolean;
  status: boolean;
  createdAt: Date;
  updateAt: Date;
};
