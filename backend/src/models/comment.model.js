import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    comments: [
      {
        tweet: {
          type: mongoose.Types.ObjectId,
          ref: "Tweet",
        },
        content: {
          type: String,
          maxlength: 280,
        },
        owner: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        likes: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", tweetSchema);

export { Comment };
