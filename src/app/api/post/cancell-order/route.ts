import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/app/config/models/Order";
import Product from "@/app/config/models/Product";

export async function POST(req: NextRequest) {
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
    const { orderID, productIDs } = await req.json();
    await Order.findOneAndUpdate(
      { "list_orders._id": orderID },
      { $set: { "list_orders.$.status": "cancelled"} }
    );
    await Promise.all(
    productIDs.map(async (value: {quantity: number, productID: string}) => 
      await Product.findByIdAndUpdate({"_id" : value.productID}, {
        $inc: {sold: - value.quantity }
      } )
    )
  )
    return NextResponse.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
