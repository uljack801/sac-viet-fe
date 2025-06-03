import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";
import UserAddress from "@/app/config/models/UserAddress";

export async function GET(req: NextRequest) {
const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }  
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY as string) as {id: string, email: string , account: string};
    if (decoded) {
      const findUserAdd = await UserAddress.findOne({ user: decoded.id})
      
      if (!findUserAdd) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      
      return NextResponse.json(
        {
          data: findUserAdd, 
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
      { status: 500, statusText: "Error" }
    );
  }
}
