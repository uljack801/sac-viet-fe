import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Product from "@/app/config/models/Product";
import User from "@/app/config/models/User";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized access!" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: string;
      email: string;
      account: string;
    };

    const findUser = await User.findById(decoded.id);
    if (!findUser || !findUser.role.includes("seller")) {
      return NextResponse.json({ message: "Unauthorized access!" }, { status: 401 });
    }

    const { dataProduct } = await req.json();
    
    const newProduct = new Product(dataProduct);
    await newProduct.save();

    return NextResponse.json({ message: "Success!" }, { status: 200 });

  } catch (error) {
    console.error("Lỗi xác thực:", error);
    return NextResponse.json({ message: "An error occurred!" }, { status: 500 });
  }
}
