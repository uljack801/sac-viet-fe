import { NextResponse } from "next/server";
import Product from "@/app/config/models/Product";

export async function GET() {
  try {
      const products = await Product.find()
      if (!products) {
        return NextResponse.json({ error: "Invalid!" }, { status: 401 });
      }
      return NextResponse.json(
        {
          data: products, 
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
