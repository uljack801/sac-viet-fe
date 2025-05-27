import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    nameShop: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String },
    typeBusiness: { type: String },
    nameCompany: {type: String},
    addressRegisterBusiness: { type: String },
    emailToReceive: { type: String },
    businessRegistrationCertificate: {
        taxNumber: { type: String }, 
        fileUrl: { type: String }, 
        isVerified: { type: Boolean, default: false },
      },   
    logoShop: { type: String },
    descriptionShop: { type: String },
    isVerified: { type: Boolean, default: false },
    socialLinks: {
      facebook: { type: String },
      zalo: { type: String },
      instagram: { type: String },
    },
    rating: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);
export default Seller;
