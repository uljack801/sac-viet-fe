import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";
import Product from "@/app/config/models/Product";
import Cart, { ListProductProps } from "@/app/config/models/Cart";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY as string) as { id: string };
    const { quantity, idProduct } = await req.json();

    const findCard = await Cart.findOne({ user: decoded.id });
    if (!findCard) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    let updated = false;
    for (const item of findCard.list_products) {
      if (item.productID === idProduct) {
        item.quantity = quantity;
        updated = true;
        break;
      }
    }
    
    if (updated) {
      await findCard.save();
    }

    const productsInCart = await Promise.all(
      findCard.list_products.map(async (item: ListProductProps) => {
        const product = await Product.findById(item.productID);
        return product ? { ...product.toObject(), quantity: item.quantity } : null;
      })
    );

    return NextResponse.json(
      {
        data: productsInCart.filter((p) => p !== null),
        message: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error",
      },
      { status: 500 }
    );
  }
}
