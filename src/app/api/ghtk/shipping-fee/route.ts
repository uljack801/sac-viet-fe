import { NextRequest } from "next/server";
import axios from "axios";
import { GHTK_TOKEN } from "@/app/helper/constant";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pick_province = searchParams.get("pick_province");
  const pick_district = searchParams.get("pick_district");
  const province = searchParams.get("province");
  const district = searchParams.get("district");
  const weight = searchParams.get("weight");
  const value = searchParams.get("value");

  if (
    !pick_province ||
    !pick_district ||
    !province ||
    !district ||
    !weight ||
    !value
  ) {
    return new Response(JSON.stringify({ error: "Missing required query parameters" }), {
      status: 400,
    });
  }
  try {
    const response = await axios.get(
      "https://services.giaohangtietkiem.vn/services/shipment/fee",
      {
        params: {
          pick_province,
          pick_district,
          province,
          district,
          weight,
          value,
        },
        headers: {
          Token: GHTK_TOKEN,
        },
      }
    );
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GHTK error:", error);
    return new Response(JSON.stringify({ error: "Error fetching shipping fee" }), {
      status: 500,
    });
  }
}
