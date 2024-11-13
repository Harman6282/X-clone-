import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      maxlength: 280,
      trim: true,
    },
    tweet: {
      type: mongoose.Types.ObjectId,
      ref: "Tweet",
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export { Comment };
