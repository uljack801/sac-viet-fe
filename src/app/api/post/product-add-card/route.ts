import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Cart, { ListProductProps } from "@/app/config/models/Cart";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return NextResponse.json(
        { message: "Unauthorized access!" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: string;
      email: string;
      account: string;
    };
    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized access!" },
        { status: 401 }
      );
    }
    const { productId, quantityChoise  } = await req.json();
    const findCard = await Cart.findOne({ user: decoded.id });
    if (!findCard) {
      return NextResponse.json({ message: "Not Found!" }, { status: 404 });
    }
    const index = findCard.list_products.findIndex((item: ListProductProps) => item.productID === productId);
    if(index !== -1){
      const [existingProduct] = findCard.list_products.splice(index, 1);
       existingProduct.quantity = quantityChoise;
      findCard.list_products.unshift(existingProduct)
    }else{
      findCard.list_products.unshift({ productID: productId, quantity: quantityChoise });
    }
    await findCard.save();
    
    return NextResponse.json({ data: findCard , message: " Success!" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    return NextResponse.json(
      { message: "An error occurred!" },
      { status: 500 }
    );
  }
}
