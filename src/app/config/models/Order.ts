import mongoose from "mongoose";

export type OrderProps = {
  _id: string;
  user: string;
  list_orders: [
    {
      _id: string;
      products: [
        {
          productID: string;
          quantity: number;
          productName: string;
          weight: number;
        }
      ];
      shipping_fees: { [sellerId: string]: number };
      totalPay: number;
      seller_id: string;
      order_at: Date;
      tracking: string,
      address_ship: string;
      total_money_ship: number;
      status: string;
      payment_method: string;
      is_paid: boolean;
      paid_at: Date;
      is_review: boolean;
      cancelled_at: Date;
      note: string;
      
    }
  ];
};

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    list_orders: [
      {
        products: [
          {
            productID: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            productName: { type: String },
            weight: { type: Number },
            quantity: { type: Number, required: true },
          },
        ],
        seller_id: { type: String },
        order_at: { type: Date, default: Date.now },
        address_ship: { type: String },
        total_money_ship: { type: Number },
        shipping_fees: {
          type: Map,
          of: Number,
          default: {},
        },
        status: {
          type: String,
          enum: ["pending", "shipped", "delivered", "cancelled", "returned"],
          default: "pending",
        },
        payment_method: {
          type: String,
          enum: ["cod", "bank-transfer", "credit_card", "paypal"],
          default: "cod",
        },
        tracking: {type: String},
        is_paid: { type: Boolean, default: false },
        paid_at: { type: Date },
        is_review: { type: Boolean, default: false },
        cancelled_at: { type: Date },
        note: { type: String },
        totalPay: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
