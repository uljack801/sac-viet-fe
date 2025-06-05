import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId , ref: "User", required: true},
    name: {type : String},
    image: {type: [String]},
    content: {type : String},
    likes: [{
        user: {type: mongoose.Schema.Types.ObjectId , ref: "User", required: true},
    }],
    comments : [{
        user: {type: mongoose.Schema.Types.ObjectId , ref: "User", required: true},
        name: {type : String},
        comment: {type: String},
        image: {type: [String]},
        createdAt: { type: Date,default: Date.now},
        status: { type: Boolean, default: true },
        likes: [{
                user: {type: mongoose.Schema.Types.ObjectId , ref: "User", required: true},
            }],  
        isEdit:{ type: Boolean, default: false },
        reply :[{
             user: {type: mongoose.Schema.Types.ObjectId , ref: "User", required: true},
             comment: {type: String},
             image: {type: [String]},
             name: {type : String},
             createdAt: { type: Date,default: Date.now},
             likes: [{
                    user: {type: mongoose.Schema.Types.ObjectId , ref: "User", required: true},
                }],            
            status: { type: Boolean, default: true },
            isEdit:{ type: Boolean, default: false },
            
        }]
    }],
    isEdit:{ type: Boolean, default: false },
    status: { type: Boolean, default: true }
}, {timestamps: true})


const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema)
export default Conversation