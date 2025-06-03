import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    img: {
      type: [String],
    },
    video: {
      type: String,
    },
    sold: {
      type: Number,
      default: 0,
    },
    discount_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    color: {
      type: [String],
    },
    material: {
      type: [String],
    },
    dimensions: {
      type: String,
      default: "",
    },
    origin: {
      type: String,
      default: "",
    },
    handmade: {
      type: Boolean,
      default: true,
    },
    warranty: {
      type: String,
      default: "",
    },
    care_instructions: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    inventory: {
      type: Number,
      required: true,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    weight: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
