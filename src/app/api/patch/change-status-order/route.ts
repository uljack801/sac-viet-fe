import { NextRequest, NextResponse } from "next/server";
import User from "@/app/config/models/User";
import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";
import Order from "@/app/config/models/Order";

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY as string) as {
      id: string;
      email: string;
      account: string;
    };

    if (decoded) {
      const findUserSeller = await User.findOne({ _id: decoded.id }).select(
        "-password -token"
      );

      if (!findUserSeller) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      if (findUserSeller.role.includes("seller")) {
        const { searchParams } = new URL(req.url);
        const orderID = searchParams.get("order-id");
        const findOrder = await Order.find();

        for (const order of findOrder) {
          let updated = false;

          for (const res of order.list_orders) {
            if (res._id.toString() === orderID) {
              res.status = "shipped";
              updated = true;
              break;
            }
          }

          if (updated) {
            await order.save();
            break;
          }
        }
        return NextResponse.json(
          {
            message: "Success",
          },
          { status: 200, statusText: "Success" }
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        data: null,
        message: "Error",
      },
      { status: 400, statusText: "Failed" }
    );
  }
}
