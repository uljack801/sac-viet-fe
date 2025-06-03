import mongoose from "mongoose";

const UserAddressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    list_address: [{
        phone: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        capital: {type: String},
        district: {type: String},
        commune: {type: String},
        deatails : {type: String},
        is_default: { type: Boolean, default: false }
    }]
}, { timestamps: true})

const UserAddress = mongoose.models.UserAddress || mongoose.model("UserAddress", UserAddressSchema);

export default UserAddress;
