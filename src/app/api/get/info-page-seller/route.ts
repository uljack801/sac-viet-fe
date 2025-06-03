import Seller from "@/app/config/models/Seller";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@/app/helper/constant";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer")) {
      return NextResponse.json(
        {
          message: "Unauthorization",
        },
        { status: 401 }
      );
    }
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    const findSeller = await Seller.findOne({ user: decoded.id });
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
