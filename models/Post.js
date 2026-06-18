import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 5 },
    content: { type: String, required: true, minlength: 20 },
    category: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    likes: { type: [String], default: [] },
  },
  { timestamps: true }
);

postSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Post", postSchema);
