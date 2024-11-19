import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Comment } from "../models/comment.model.js";

const postTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  const { content } = req.body;
  const mediaPath = req.file?.path;

  if (!content && !mediaPath) {
    throw new apiError(
      400,
      "Please provide either content or media for the post"
    );
  }
  let mediaUrl = null;
  let media_publicId = null;

  if (mediaPath) {
    const result = await uploadOnCloudinary(mediaPath);
    mediaUrl = result.secure_url;
    media_publicId = result.public_id;
  }

  const post = await Tweet.create({
    content: content || null,
    media: mediaUrl || null,
    media_publicId: media_publicId || null,
    owner: userId,
  });

  if (!post) {
    throw new apiError(500, "Error while uploading post");
  }

  return res
    .status(200)
    .json(new apiResponse(200, post, "Post created successfully"));
});

const editTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new apiError(400, "Please provide content to be updated");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      content: content,
    },
    { new: true }
  );

  if (!updatedTweet) {
    throw new apiError(500, "Error while updating the post");
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const tweetId = new mongoose.Types.ObjectId(req.params.tweetId);
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new apiError(404, "Tweet not found");
  }

  if (userId.toString() !== tweet.owner.toString()) {
    throw new apiError(400, "You are not authorized for this action");
  }
  await deleteFromCloudinary(tweet.media_publicId);
  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { deletedTweet: deletedTweet },
        "Tweet deleted successfully"
      )
    );
});
const getAllTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.aggregate([
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet",
        as: "comments",
      },
    },
    {
      $unwind: {
        path: "$comments",
        preserveNullAndEmptyArrays: true
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.owner",
        foreignField: "_id",
        as: "comments.ownerDetails",
      },
    },
    {
      $unwind: {
        path: "$comments.ownerDetails",
        preserveNullAndEmptyArrays: true
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner", // Flattening the owner array
    },
    {
      $group: {
        _id: "$_id",
        content: { $first: "$content" },
        media: { $first: "$media" },
        owner: { $first: "$owner" },
        likes: { $first: "$likes" },
        createdAt: { $first: "$createdAt" },
        comments: {
          $push: {
            _id: "$comments._id",
            content: "$comments.content",
            createdAt: "$comments.createdAt",
            owner: {
              _id: "$comments.ownerDetails._id",
              username: "$comments.ownerDetails.username",
              avatar: "$comments.ownerDetails.avatar",
            },
          },
        },
      },
    },
    {
      $project: {
        content: 1,
        media: 1,
        "owner._id": 1,
        "owner.name": 1,
        "owner.avatar": 1,
        "owner.username": 1,
        likes: 1,
        createdAt: 1,
        comments: 1,
      },
    },
  ]);

  console.log(tweets);

  return res
    .status(200)
    .json(new apiResponse(200, tweets, "All tweets fetched successfylly"));
});

const getTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const currtweet = await Tweet.findById(tweetId);
  if (!currtweet) {
    throw new apiError(404, "Tweet not found");
  }

  const tweet = await Tweet.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(tweetId),
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet",
        as: "comments",
      },
    },
    {
      $unwind: "$comments",
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.owner",
        foreignField: "_id",
        as: "comments.ownerDetails",
      },
    },
    {
      $unwind: "$comments.ownerDetails",
    },
    {
      $group: {
        _id: "$_id",
        content: { $first: "$content" },
        media: { $first: "$media" },
        owner: { $first: "$owner" },
        likes: { $first: "$likes" },
        createdAt: { $first: "$createdAt" },
        comments: {
          $push: {
            _id: "$comments._id",
            content: "$comments.content",
            createdAt: "$comments.createdAt",
            owner: {
              _id: "$comments.ownerDetails._id",
              username: "$comments.ownerDetails.username",
              avatar: "$comments.ownerDetails.avatar",
            },
          },
        },
      },
    },
    {
      $project: {
        content: 1,
        media: 1,
        owner: 1,
        likes: 1,
        createdAt: 1,
        comments: 1,
      },
    },
  ]);

  console.log(tweet[0].comments);

  return res
    .status(200)
    .json(new apiResponse(200, tweet[0], "Tweet fetched successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new apiError(404, "Tweet not found");
  }

  // Check if the user has already liked the tweet
  const hasLiked = tweet.likes.includes(userId);

  // toggling the like and unlike tweet

  if (hasLiked) {
    await tweet.updateOne({ $pull: { likes: userId } });
    return res
      .status(200)
      .json(new apiResponse(200, null, "Tweet unliked successfully"));
  } else {
    await tweet.updateOne({ $push: { likes: userId } });
    return res
      .status(200)
      .json(new apiResponse(200, null, "Tweet liked successfully"));
  }
});

const getFollowingUsersTweets = asyncHandler(async (req, res) => {});

export {
  postTweet,
  editTweet,
  deleteTweet,
  getAllTweets,
  getTweetById,
  toggleTweetLike,
  getFollowingUsersTweets,
};
