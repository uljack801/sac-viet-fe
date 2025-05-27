import User from "@/app/config/models/User";
import { SECRET_KEY } from "@/app/helper/constant";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY as string) as {id: string, email: string , account: string};
    
    const {fullname, phoneNumber, dateOfBirth , gender} = await req.json();

    const UpdateinfoUser = await User.findOne({_id: decoded.id}).select("-password -token");

    if (!UpdateinfoUser) {
        return NextResponse.json({ message: "Không tìm thấy thông tin user!" }, { status: 404 });
    }

    UpdateinfoUser.fullname = fullname;
    UpdateinfoUser.phoneNumber = phoneNumber;
    UpdateinfoUser.date_of_birth = dateOfBirth;
    UpdateinfoUser.gender = gender;

    await UpdateinfoUser.save();
    const data = UpdateinfoUser
    
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
