import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@/app/helper/constant";
import Order from "@/app/config/models/Order";
import Cart, { ListProductProps } from "@/app/config/models/Cart";

export async function PATCH(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || !auth?.startsWith("Bearer")) {
      return NextResponse.json(
        {
          message: `UnAuthorization`,
        },
        { status: 401 }
      );
    }
    const token = auth.split(" ")[1];
    const decode = jwt.verify(token, SECRET_KEY) as { id: string };
    const findOrder = await Order.findOne({ user: decode.id });
    if (!findOrder) {
      return NextResponse.json(
        {
          message: `NotFound Order`,
        },
        { status: 404 }
      );
    }
    const { products, payment_method, address_ship, total_money_ship , shipping_fees, seller_id } =
      await req.json();
    
    if (
      !Array.isArray(products) ||
      !payment_method ||
      !address_ship ||
      !shipping_fees ||
      !total_money_ship === undefined || !seller_id
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    findOrder.list_orders.push({
      products: products,
      address_ship: address_ship,
      total_money_ship: total_money_ship,
      payment_method: payment_method,
      shipping_fees: shipping_fees,
      seller_id: seller_id
    });

    await findOrder.save();
    
    const cart = await Cart.findOne({ user: decode.id });

    const validProductIDs = products.map((p) => p.productID);
    
    cart.list_products = cart.list_products.filter(
      (item: ListProductProps) => !validProductIDs.includes(item.productID)
    );
    await cart.save();

    return NextResponse.json(
      {
        message: "Success!",
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
