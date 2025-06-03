import User from "@/app/config/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { SECRET_KEY } from "@/app/helper/constant";
import Seller from "@/app/config/models/Seller";
import sendEmail from "@/app/utils/sendEmail";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: string;
      email: string;
      account: string;
    };
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorization" }, { status: 401 });
    }

    const findUser = await User.findOne({ _id: decoded.id }).select(
      "-password -token"
    );
    if (!findUser) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }
    const {
      nameShop,
      email,
      phoneNumber,
      address,
      typeBusiness,
      addressRegisterBusiness,
      emailToReceive,
      taxNumber,
      nameCompany,
    } = await req.json();

    if (!email || !phoneNumber || !address) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const existingShop = await Seller.findOne({ nameShop: nameShop });
    if (existingShop) {
      return NextResponse.json(
        { message: "Tên shop đã tồn tại!" },
        { status: 400 }
      );
    }

    const newSeller = await Seller.create({
      user: decoded.id,
      nameShop,
      email,
      phoneNumber,
      address,
      typeBusiness,
      addressRegisterBusiness,
      emailToReceive,
      nameCompany,
      businessRegistrationCertificate: {
        taxNumber,
      },
    });
    await sendEmail(
      emailToReceive,
      "Xác nhận đăng ký tài khoản Seller",
      `
    Xin chào ${nameShop},
    Cảm ơn bạn đã đăng ký tài khoản Seller trên nền tảng của chúng tôi.
    Yêu cầu của bạn đang được xử lý và sẽ được phê duyệt trong vòng 1 - 2 ngày làm việc.
    Chúng tôi sẽ gửi email thông báo ngay khi tài khoản của bạn được duyệt.
    Trân trọng,
    Đội ngũ hỗ trợ Sàn Thương mại<
  `
    );
    const response = NextResponse.json(
      {
        newSeller,
        message: "Success",
      },
      { status: 200 }
    );
    findUser.isSellerApproved = true;
    await findUser.save();

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred, please try again later!",
      },
      { status: 500 }
    );
  }
}
