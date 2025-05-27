import mongoose, { model, models } from "mongoose";

const ContactFromCustomer = new mongoose.Schema({
    name : {type: String}, 
    email: {type: String}, 
    phone: {type: String}, 
    message: {type: String}, 
},{timestamps: true})

const Contact = models.message_from_customers || model("message_from_customers", ContactFromCustomer);
export default Contact