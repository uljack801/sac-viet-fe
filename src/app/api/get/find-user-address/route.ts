import { NextRequest, NextResponse } from "next/server";
import User from "@/app/config/models/User";
import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";
import UserAddress from "@/app/config/models/UserAddress";
import { UserAddressProps } from "@/app/components/type/user.type";
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY as string) as {
      id: string;
      email: string;
      account: string;
    };

    if (decoded) {
      const findUserSeller = await User.findOne({ _id: decoded.id }).select(
        "-password -token"
      );
      if (!findUserSeller) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      if (findUserSeller.role.includes("seller")) {
        const { searchParams } = new URL(req.url);
        const userID = searchParams.get("user-id");
        const addressID = searchParams.get("address-id");
        if (userID) {
          const findUserAddressOrder: UserAddressProps | null= await UserAddress.findOne({
            user: userID,
          });
          
          const addressFound = findUserAddressOrder?.list_address.find(
            (item) => item._id.toString() === addressID
          );
          if (!findUserAddressOrder) {
            return NextResponse.json(
              { error: "Invalid token" },
              { status: 401 }
            );
          }
          return NextResponse.json(
            {
              data: addressFound,
              message: "Success",
            },
            { status: 200, statusText: "Success" }
          );
        }
      }
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
