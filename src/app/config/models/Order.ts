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
        }
      ];
      shipping_fees: { [sellerId: string]: number };
      order_at: Date;
      address_ship: string;
      total_money_ship: number;
      status: string;
      payment_method: string;
      is_paid: boolean;
      paid_at: Date;
      is_review: boolean;
      cancelled_at: Date;
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
            quantity: { type: Number, required: true },
          },
        ],
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
        is_paid: { type: Boolean, default: false },
        paid_at: { type: Date },
        is_review: { type: Boolean, default: false },
        cancelled_at: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
