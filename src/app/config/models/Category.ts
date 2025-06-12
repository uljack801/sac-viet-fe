import mongoose, { model, models } from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {type: String},
    slug: {type: String},
    icon: {type: String},
    status: {type: Boolean, default: true}
}, {timestamps: true})

const Category = models.Category || model('Category', CategorySchema)
export default Category