import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://archive.org/download/twitter-default-pfp/e.png",
    },
    avatar_public_id: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
    },
    coverImage_public_id: {
      type: String,
      default: "",
    },
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User };
