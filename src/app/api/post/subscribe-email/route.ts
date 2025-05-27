import SubscribeEmail from "@/app/config/models/SubscribeEmail";
import { connectDB } from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { emailCustomer } = await req.json();

    const existingEmail = await SubscribeEmail.findOne({ emailCustomer });
    if (!existingEmail) {
      const newSubscription = await SubscribeEmail.create({ emailCustomer });

      return NextResponse.json(
        {
          data: newSubscription,
          message: "Subscription successful!",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "This email is already subscribed!",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in email subscription:", error);
    return NextResponse.json(
      {
        message: "An error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
