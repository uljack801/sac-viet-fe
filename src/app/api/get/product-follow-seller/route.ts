import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/config/models/Product";
import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";

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
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const sellerID = searchParams.get("seller-id");
      const option = searchParams.get("option");
      const limit = 10;
      const skip = (page - 1) * limit;

      const sortCondition: Record<string, 1 | -1> = {};
      if (option === "best-seller") {
        sortCondition.sold = -1;
      } else if (option === "slow-seller") {
        sortCondition.sold = 1;
      } else if (option === "in-stock") {
        sortCondition.inventory = -1;
      } else if (option === "out-of-stock") {
        sortCondition.inventory = 1;
      }else if (option === "high-discount") {
        sortCondition.discount_percentage = -1;
      }else if (option === "low-discount") {
        sortCondition.discount_percentage = 1;
      }else{
      }
      const products = await Product.find({ seller_id: sellerID })
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

      const totalProducts = await Product.countDocuments({
        seller_id: sellerID,
      });

      return NextResponse.json(
        {
          data: products,
          currentPage: page,
          totalProducts: totalProducts,
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
