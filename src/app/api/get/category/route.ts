import { NextResponse } from "next/server";
import Category from "@/app/config/models/Category";
import { connectDB } from "@/app/config/mongoose";

export async function GET() {
    await connectDB()
  try {
      const listCategory = await Category.find()
      if (!listCategory) {
        return NextResponse.json({ error: "Invalid!" }, { status: 401 });
      }
      return NextResponse.json(
        {
          data: listCategory, 
          message: "Success",
        },
        { status: 200, statusText: "Success" }
      );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error",
      },
      { status: 500, statusText: "Error" }
    );
  }
}
