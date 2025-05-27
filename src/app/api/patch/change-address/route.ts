import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";
import UserAddress from "@/app/config/models/UserAddress";
import { UserAddressProps } from "@/app/components/type/user.type";

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return NextResponse.json(
        {
          message: "Unauthorization",
        },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    if (!decoded) {
      return NextResponse.json(
        {
          message: "Unauthorization",
        },
        { status: 401 }
      );
    }
    const findUserAddress = await UserAddress.findOne({ user: decoded.id });

    if (!findUserAddress) {
      return NextResponse.json(
        {
          message: "Not find address",
        },
        { status: 404 }
      );
    }
    const { idAddress } = await req.json();
    findUserAddress.list_address = findUserAddress.list_address.map(
      (address: UserAddressProps) => {
        return {
          ...address,
          is_default: address._id.toString() === idAddress,
        };
      }
    );

    await findUserAddress.save();

    return NextResponse.json(
      {
        data: findUserAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
