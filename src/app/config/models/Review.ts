import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user_name: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        default: '',
    },
    images: {
        type: [String],
      },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export default Review