import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@/app/helper/constant";
import Order from "@/app/config/models/Order";

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
    const findOrder = await Order.findOne({ user: decoded.id });
    if (!findOrder) {
      return NextResponse.json(
        {
          message: "Not Found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: findOrder,
        message: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error: ${error}`,
      },
      { status: 501 }
    );
  }
}
