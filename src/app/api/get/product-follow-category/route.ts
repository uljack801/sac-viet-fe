import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/config/models/Product";
import Category from "@/app/config/models/Category";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const sortPrice = searchParams.get("sort");
    const typeCategory = searchParams.get("typeCategory");

    const limit = 24;
    const skip = (page - 1) * limit;

    const category = await Category.findOne({ slug: typeCategory });
    if (!category) {
      return NextResponse.json({ error: "Invalid category!" }, { status: 400 });
    }

    const sortCondition: Record<string, 1 | -1>  = {}; 
    if (sortPrice === "price-up") {
      sortCondition.price = 1;
    } else if (sortPrice === "price-down") {
      sortCondition.price = -1;
    } else if(sortPrice === "best-selling"){
      sortCondition.sold = -1;
    } else if(sortPrice === "biggest-discount"){
      sortCondition.discount_percentage = -1;
    }
    
    const products = await Product.find({ category_id: category._id, status: true })
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      category_id: category._id,
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
