import Contact from "@/app/config/models/Contact";
import { connectDB } from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name, email, phone, message } = await req.json();
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "All fields (name, email, phone, message) are required!" },
        { status: 400 }
      );
    }
    const newSend = await Contact.create({ name, email, phone, message });
    return NextResponse.json(
      {
        data: newSend,
        message: "Message sent successfully!",
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
