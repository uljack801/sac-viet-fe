import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";
import User from "@/app/config/models/User";

export async function GET(req: NextRequest) {
const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }  
  try {
    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, SECRET_KEY as string) as {id: string, email: string , account: string};

    if (decoded) {
      const findUser = await User.findOne({ _id: decoded.id}).select("-password -token")
      if (!findUser) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      return NextResponse.json(
        {
          data: findUser, 
          message: "Success",
        },
        { status: 200, statusText: "Success" }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        data: null,
        message: "Error",
      },
      { status: 400, statusText: "Failed" }
    );
  }
}
