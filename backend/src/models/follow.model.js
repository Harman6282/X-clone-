import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(
  {
    follower: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    following: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Follow = mongoose.model("Follow", followSchema);

export { Follow };
