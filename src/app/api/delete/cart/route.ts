import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";
import Product from "@/app/config/models/Product";
import Cart, { ListProductProps } from "@/app/config/models/Cart";

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY as string) as { id: string };
    const { idProduct } = await req.json();

    const findCard = await Cart.findOne({ user: decoded.id });
    if (!findCard) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    let updated = false;
    const newList = findCard.list_products.filter((item:ListProductProps) => item.productID !== idProduct);
    if (newList.length !== findCard.list_products.length) {
      findCard.list_products = newList;
      updated = true;
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
