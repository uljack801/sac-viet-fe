import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    emailCustomer: String
}, {timestamps: true});

const SubscribeEmail = mongoose.models.subscribe_emails || mongoose.model('subscribe_emails' , PostSchema)
export default SubscribeEmail