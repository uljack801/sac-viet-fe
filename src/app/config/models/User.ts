import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema  = new mongoose.Schema({
    account: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token : {type: String},
    is_authenticated: { type: Boolean },
    fullname: {type: String},
    phoneNumber: {type: String},
    avatar: {type: String},
    date_of_birth: {type: Date},
    gender: {type: String},
    role: { type: [String], enum: ["seller", "user", "admin"], default: ["user"] },
    user_address: { type: mongoose.Schema.Types.ObjectId, ref: "UserAddress" , required: false },
    ordered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" , required: false }],
    card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" , required: false  },
}, {timestamps: true})

userSchema.pre('save' , async function (next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password , salt);
    next()
})
const User = mongoose.models.users || mongoose.model('users' , userSchema)
export default User