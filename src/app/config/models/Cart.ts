import mongoose from "mongoose";

export type ListProductProps = {
  productID: string;
  _id: string;
  quantity: number;
  sellerID: string;
  added_at: Date;
};

export type CartProps = [
  {
    _id: string;
    user: string;
    list_products: [
      {
        _id: string;
        sellerID: string;
        productID: string;
        quantity: number;
        added_at: Date;
      }
    ];
  }
];

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    list_products: [
      {
        sellerID: { type: String },
        productID: { type: String },
        quantity: { type: Number },
        added_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
