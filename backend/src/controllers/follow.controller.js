import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";

const toggleFollow = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const followingUserId = new mongoose.Types.ObjectId(req.params.userId);

  const profileUser = await User.findById(followingUserId); // checking if the user exists
  if (!profileUser) {
    throw new apiError(404, "user not found");
  }

  if (userId == followingUserId) {
    throw new apiError(400, "users cannot follow themselves");
  }

  // Check if the follow relationship exists
  const existingFollow = await Follow.findOne({
    follower: userId,
    following: followingUserId,
  });

  if (existingFollow) {
    // If the relationship exists, unfollow (delete)
    await Follow.deleteOne({ _id: existingFollow._id });
    return res
      .status(200)
      .json(
        new apiResponse(200, { isFollowing: false }, "Unfollowed successfully")
      );
  } else {
    // If the relationship does not exist, follow (create)
    const newFollow = await Follow.create({
      follower: userId,
      following: followingUserId,
    });
    return res
      .status(200)
      .json(
        new apiResponse(200, { isFollowing: true }, "Followed successfully")
      );
  }
});

export { toggleFollow };
