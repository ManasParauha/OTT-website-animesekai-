
import mongoose, { Schema } from "mongoose";


const CommentSchema = new Schema(
    {
      content: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      hubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
      createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  const Comment = mongoose.models.comments || mongoose.model("comments", CommentSchema)
  
  export default Comment;