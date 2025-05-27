import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/config/models/Product";
import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";
import User from "@/app/config/models/User";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET_KEY as string) as {
      id: string;
      email: string;
      account: string;
    };    
    if (decoded) {
      const findUser = await User.findOne({ _id: decoded.id }).select(
        "-password -token"
      );
      if (!findUser) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = 10;
      const skip = (page - 1) * limit;

      const products = await Product.find({ seller_id: findUser.seller_id })
        .skip(skip)
        .limit(limit);
      
      const totalProducts = await Product.countDocuments({
        seller_id: findUser.seller_id,
      });

      return NextResponse.json(
        {
          data: products,
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          message: "Success",
        },
        { status: 200 }
      );
    }
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
