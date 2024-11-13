import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";

const addComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new apiError(400, "Please write the comment content");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new apiError(404, "Tweet not found");
  }

  const createComment = await Comment.create({
    content: content,
    tweet: tweetId,
    owner: userId,
  });

  return res
    .status(200)
    .json(new apiResponse(200, createComment, "Comment added successfully"));
});

const editComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { content } = req.body;
  const { commentId } = req.params;

  if (!content) {
    throw new apiError(400, "Commment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (userId.toString() !== comment.owner.toString()) {
    throw new apiError(400, "You are not authorized for this action");
  }

  const updatedComment = await Comment.findByIdAndUpdate(commentId, {
    content: content,
  });

  return res
    .status(200)
    .json(new apiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);

  console.log(comment);

  if (userId.toString() !== comment.owner.toString()) {
    throw new apiError(400, "You are not authorized for this action");
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new apiResponse(200, deletedComment, "Comment deleted successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new apiError(404, "comment not found");
  }

  // Check if the user has already liked the comment
  const hasLiked = comment.likes.includes(userId);

  // toggling the like and unlike tweet

  if (hasLiked) {
    await comment.updateOne({ $pull: { likes: userId } });
    return res
      .status(200)
      .json(new apiResponse(200, null, "Comment unliked successfully"));
  } else {
    await comment.updateOne({ $push: { likes: userId } });
    return res
      .status(200)
      .json(new apiResponse(200, null, "Comment liked successfully"));
  }
});

export { addComment, editComment, deleteComment, toggleCommentLike };
