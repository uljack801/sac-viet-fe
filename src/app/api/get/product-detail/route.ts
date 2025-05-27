import Product from "@/app/config/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId"); 
    if (!productId || !searchParams) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }
    const findProduct = await Product.findOne({ _id: productId });
    
    if (!findProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: [findProduct],
        message: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "ERROR",
      },
      { status: 500 }
    );
  }
}
