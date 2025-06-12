import { GHTK_TOKEN } from "@/app/helper/constant";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { tracking } = await req.json();
    console.log(tracking);
    
    if (!tracking) {
      return NextResponse.json(
        { message: "Thiếu dữ liệu" },
        { status: 400 }
      );
    }
    
    const response = await axios.post(
      "https://services.giaohangtietkiem.vn/services/shipment/cancel/",
      { label_id: tracking },
      {
        headers: {
          "Content-Type": "application/json",
          Token: GHTK_TOKEN,
        },
      }
    );

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    console.error("GHTK Error:", error);

    return NextResponse.json(
      {
        message: "Hủy đơn thất bại",
        error: error || "Unknown error",
      },
      { status: 500 }
    );
  }
}
