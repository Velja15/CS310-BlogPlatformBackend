import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: String, required: true, minlength: 1 },
  },
  { timestamps: true }
);

commentSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Comment", commentSchema);
