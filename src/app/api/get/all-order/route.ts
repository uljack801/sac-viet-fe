import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@/app/helper/constant";
import Order from "@/app/config/models/Order";
import User from "@/app/config/models/User";

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
    const findUser = await User.findById(decoded.id);
    if (!findUser.role.includes("seller")) {
      return NextResponse.json(
        {
          message: "Unauthorization",
        },
        { status: 401 }
      );
    }
    const findOrder = await Order.find();
    if (!findOrder) {
      return NextResponse.json(
        {
          message: "Not Found",
        },
        { status: 404 }
      );
    }
    const { searchParams } = new URL(req.url);
    const sellerID = searchParams.get("seller-id");
    
    const findOrderOfSeller = findOrder.map((order) =>{
       const filteredListOrders = order.list_orders.filter((value: { seller_id: string | null; }) => value.seller_id === sellerID)
       if(filteredListOrders.length > 0 ){
        return{
          ...order.toObject(),
          list_orders: filteredListOrders
        }
       }
           return null;
    }).filter(order => order !== null);

    return NextResponse.json(
      {
        data: findOrderOfSeller,
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
