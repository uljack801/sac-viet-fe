import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserAddress from "@/app/config/models/UserAddress";
import User from "@/app/config/models/User";

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY as string) as {id: string, email: string , account: string};
    
    const { address, phone, name ,capital , commune , district , deatails } = await req.json();

    const UpdateinfoUser = await UserAddress.findOne({user: decoded.id});
      
    if (!UpdateinfoUser) {
        return NextResponse.json({ message: "Không tìm thấy thông tin user!" }, { status: 404 });
    }
    let is_default = false
    if(UpdateinfoUser.list_address.length === 0){
      is_default = true
    }
    UpdateinfoUser.list_address.push({address, phone, name ,capital , commune , district , deatails, is_default}) ;
    if (UpdateinfoUser.list_address.length > 3) {
        UpdateinfoUser.list_address.shift();
      }
   
    await UpdateinfoUser.save();
    const data = await User.findOne({_id: decoded.id}).select("-password -token")
    return NextResponse.json({ message: "Cập nhật thành công!", data });

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
