import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// post tweet
// update tweet
// delete tweet
// get all tweet
// get tweet by id
// like/unlike tweet
// get followig users tweets

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

const updateTweet = asyncHandler(async (req, res) => {});
const deleteTweet = asyncHandler(async (req, res) => {});
const getAllTweets = asyncHandler(async (req, res) => {});
const getTweetById = asyncHandler(async (req, res) => {});
const toggleTweetLike = asyncHandler(async (req, res) => {});

export {
  postTweet,
  updateTweet,
  deleteTweet,
  getAllTweets,
  getTweetById,
  toggleTweetLike,
};
