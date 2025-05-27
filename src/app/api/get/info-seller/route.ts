import Seller from "@/app/config/models/Seller";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams }  = new URL(req.url) ;
    const sellerID = searchParams.get("seller-id")
    const findSeller = await Seller.findOne({_id : sellerID});
    if (!findSeller) {
      return NextResponse.json({ error: "Invalid!" }, { status: 401 });
    }
    return NextResponse.json(
      {
        data: findSeller,
        message: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error",
      },
      { status: 500 }
    );
  }
}
