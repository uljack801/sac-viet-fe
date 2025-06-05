import { NextResponse } from "next/server";
import Conversation from "@/app/config/models/Conversation";

export async function GET() {
  try {
      const conversation = await Conversation.find({status: true})      
      if (!conversation) {
        return NextResponse.json({ error: "Invalid!" }, { status: 401 });
      }
      return NextResponse.json(
        {
          data: conversation, 
          message: "Success",
        },
        { status: 200 }
      );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error",
      },
      { status: 500 }
    );
  }
}
