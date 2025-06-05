import { NextRequest, NextResponse } from "next/server";
import Article from "@/app/config/models/Article";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const articleID = searchParams.get("article-id");
    if (!articleID) {
      return NextResponse.json({ error: "Not Found!" }, { status: 404 });
    }
    const article = await Article.findById(articleID);
    if (!article) {
      return NextResponse.json({ error: "Invalid!" }, { status: 401 });
    }
    return NextResponse.json(
      {
        data: article,
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
