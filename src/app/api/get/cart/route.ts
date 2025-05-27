import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";
import Product from "@/app/config/models/Product";
import Cart, { ListProductProps } from "@/app/config/models/Cart";

export async function GET(req: NextRequest) {
const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }  
  try {
    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, SECRET_KEY as string) as {id: string, email: string , account: string};

    if (decoded) {
      const findCard = await Cart.findOne({ user: decoded.id})
      
      if (!findCard) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      const findProduct = await Promise.all(
        findCard.list_products.map(async (value: ListProductProps) =>{
          const product = await Product.findOne({ _id: value.productID });
          return product && { ...product.toObject(), quantity: value.quantity }
          } 
        )
      );
      return NextResponse.json(
        {
          data: findProduct,
          message: "Success",
        },
        { status: 200, statusText: "Success" }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error",
      },
      { status:500 }
    );
  }
}
