import Review from "@/app/config/models/Review";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Invalid!" }, { status: 401 });
    }
    const review = await Review.find({product_id: productId});

    if (!review) {
      return NextResponse.json({ error: "Invalid!" }, { status: 401 });
    }
    return NextResponse.json(
      {
        data: review,
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
