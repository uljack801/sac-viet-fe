import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
   title: {type: String, required: true},
   img: {type: [String]},
   source: {type: String},
  content: {type: String},
  tags: {type: [String]},
  date_at: {type: Date, default: Date.now},
  author: { type: String, required: true },
 views: { type: Number, default: 0 },
 status: { type: String, enum: ["draft", "published", "archived"], default: "draft" }
}, { timestamps: true})

const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default Article;
