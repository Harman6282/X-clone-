import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    media: {
      type: String,
    },
    media_publicId: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      },
    ],
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
