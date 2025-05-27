import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/config/models/User";
import Product from "@/app/config/models/Product";

export async function PATCH(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productID, sellerID } = await req.json();
    if (!productID || !sellerID) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const findUser = await User.findById(decoded.id).select('-password -token');
    if (!findUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (findUser.seller_id.toString() !== sellerID) {
      return NextResponse.json({ message: "Permission denied" }, { status: 403 });
    }
    const findProduct = await Product.findById(productID);    
    if (!findProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    findProduct.status = !findProduct.status
    await findProduct.save()
    return NextResponse.json({ message: "Product status updated"}, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
