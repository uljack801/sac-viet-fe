import Order from "@/app/config/models/Order";
import Review from "@/app/config/models/Review";
import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
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

    const { product_id, user_id, user_name, rating, comment, orderID } =
      await req.json();
    if (decoded.id === user_id) {
      await Review.create({
        product_id,
        user_id,
        user_name,
        rating,
        comment,
      });
      const updateOrder = await Order.findOne({ user: user_id });

      if (updateOrder) {
        for (const value of updateOrder.list_orders) {
          if (value._id.toString()  === orderID) {
            value.is_review = true;
            break;
          }
        }
        await updateOrder.save();
      }

      return NextResponse.json(
        {
          message: `Success`,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: `ERROR: ${error}`,
      },
      { status: 501 }
    );
  }
}
