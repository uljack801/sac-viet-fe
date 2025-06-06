import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Seller from "@/app/config/models/Seller";

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY as string) as {id: string, email: string , account: string};
    if(!decoded){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { address , sellerID } = await req.json();

   const data = await Seller.findByIdAndUpdate({_id: sellerID}, {address: address} , { new: true });
    
    return NextResponse.json({ message: "Cập nhật thành công!" , data});

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
