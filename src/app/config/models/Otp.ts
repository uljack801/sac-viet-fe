import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    email: {type : String , required: true, unique: true},
    otp: {type : String },
    accessTokenRegis: {type: String},
    createdAt: {type: Date , default: Date.now, expires: 300 },
})

const Otp = mongoose.models.user_otps  || mongoose.model("user_otps", OtpSchema)
export default Otp;
