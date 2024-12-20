import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, MessageCircle, Repeat, Share } from "react-feather";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
function TweetById() {
  const [commentContent, setCommentContent] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [post, setPost] = useState(null);
  const { tweetId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentLikeCount, setCommentLikeCount] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  async function fetchCurrUser() {
    try {
      const response = await axios.get(`${backendUrl}/users/current-user`, {
        withCredentials: true,
      });
      setUserId(response.data.data._id);
    } catch (error) {
      console.error("Error fetching current user:", error.response || error);
    }
  }

  async function fetchTweet() {
    try {
      const response = await axios.get(`${backendUrl}/tweet/${tweetId}`, {
        withCredentials: true,
      });
      setPost(response.data.data);

      const { likes } = response.data.data;
      if (likes.includes(userId)) {
        setIsLiked((prev) => !prev);
      }
      setLikeCount(likes.length);
    } catch (error) {
      console.error("Error fetching tweet:", error.response || error);
      toast.error("Unable to load post details.");
    }
  }

  useEffect(() => {
    fetchCurrUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTweet();
    }
  }, [userId]);

  async function handleLike() {
    try {
      setIsLiked((prev) => !prev);
      const response = await axios.patch(
        `${backendUrl}/tweet/toggle-like/${tweetId}`,
        {},
        {
          withCredentials: true,
        }
      );

      const { message, data } = response.data;
      const { isLiked } = data;

      toast.success(message);
      if (isLiked) {
        setLikeCount((prev) => prev + 1);
      } else {
        setLikeCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error.response || error);
      toast.error("Failed to toggle like");
    }
  }
  async function handleCommentLike(commentId) {
    try {
      const response = await axios.patch(
        `${backendUrl}/comment/toggle-like/${commentId}`,
        {},
        { withCredentials: true }
      );

      const { message, data } = response.data;
      const { isCommentLiked } = data; // Assuming the backend returns updated like status and count
      setIsCommentLiked(isCommentLiked);
      if (isCommentLiked) {
        setCommentLikeCount((prev) => prev + 1);
      } else {
        setCommentLikeCount((prev) => prev - 1);
      }
      // Update the specific comment in the state
      setPost((prevPost) => {
        const updatedComments = prevPost.comments.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              isCommentLiked, // Update like status
            };
          }
          return comment;
        });

        return { ...prevPost, comments: updatedComments };
      });

      toast.success(message);
    } catch (error) {
      console.error("Error toggling like on comment:", error.response || error);
      toast.error("Failed to toggle comment like");
    }
  }

  async function handleComment(commentContent) {
    try {
      const response = await axios.post(
        `${backendUrl}/comment/add-comment/${tweetId}`,
        { content: commentContent },
        { withCredentials: true }
      );

      const { message } = response.data;
      toast.success(message);

      setIsCommentsOpen(false);
      fetchTweet();
    } catch (error) {
      console.error("Error posting comment:", error.response || error);
      toast.error("Failed to post comment");
    }
  }

  async function handleDelete(postId) {
    try {
      const response = await axios.delete(
        `${backendUrl}/tweet/delete-tweet/${postId}`,
        {
          withCredentials: true,
        }
      );
      const { message } = response.data;
      toast.success(message);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error.response || error);
      toast.error("Failed to delete post");
    }
  }

  return (
    <div className="flex flex-col">
      {isCommentsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#242d34] bg-opacity-50 ">
          <div className="bg-black p-4 rounded-lg w-2/6 relative  ">
            <h1 className="text-white text-center text-2xl mb-10">Comments</h1>
            <button
              onClick={() => setIsCommentsOpen(false)}
              className="absolute top-2 right-2 text-white" // Close button
            >
              <FaX className="h-4 w-4 text-white" />
            </button>
            <div className="flex items-center space-x-4">
              <textarea
                className="bg-transparent outline-none text-white px-4 py-2  w-full resize-none"
                type="text"
                name="comment"
                rows={3}
                aria-expanded="false"
                placeholder="Add a comment"
                onChange={(e) => setCommentContent(e.target.value)}
                value={commentContent}
              ></textarea>{" "}
              <button
                className="bg-[#1d9bf0] text-white px-4 py-2 rounded-full"
                onClick={() => handleComment(commentContent)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {post && (
        <div className="sticky top-0 bg-black bg-opacity-95 z-50 h-14 shadow-gray-900 shadow-sm">
          <div className="flex items-center p-2 space-x-4">
            <Link to={"/"}>
              <button className="rounded-full p-2 hover:bg-gray-800">
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
            </Link>
            <div>
              <h2 className="text-xl text-white font-bold">
                {post?.owner.name}
              </h2>
            </div>
          </div>
        </div>
      )}

      {post && (
        <div
          key={post?._id}
          className="p-4 xl:w-[667px] border-b border-gray-700 transition duration-200 cursor-pointer"
        >
          <div className="flex space-x-3">
            <Link to={`/profile/${post?.owner?._id}`}>
              <img
                src={post?.owner?.avatar}
                alt={name}
                className="h-12 w-12 rounded-full"
              />
            </Link>
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Link to={`/profile/${post?.owner?._id}`}>
                  <span className="font-bold text-white hover:underline">
                    {post?.owner?.name}
                  </span>
                  <span className="text-gray-500 hover:underline">
                    @{post?.owner?.username}
                  </span>
                </Link>
                <span className="text-gray-500">· {post?.createdAt}</span>
                {post?.owner?._id === userId && (
                  <MdDeleteOutline
                    onClick={() => handleDelete(post?._id)}
                    className="h-5 w-5 text-red-500 hover:text-red-400 right-0 absolute"
                  />
                )}
              </div>
              <p className="mt-2 text-white">{post?.content}</p>

              {post?.media && (
                <div className="mt-4">
                  {post?.media.endsWith(".mp4") ||
                  post?.media.endsWith(".webm") ? (
                    <video
                      src={post?.media}
                      controls
                      muted
                      className="w-full max-w-xl rounded-lg"
                    />
                  ) : (
                    <img
                      src={post?.media}
                      alt="Media"
                      className="w-full max-w-xl rounded-lg"
                    />
                  )}
                </div>
              )}

              <div className="flex justify-between mt-4 w-full max-w-md">
                <div className="flex items-center space-x-1 mr-4 text-gray-500 group">
                  {post?.comments.length}
                  <div
                    className="p-2 rounded-full group-hover:bg-blue-900/40 group-hover:text-blue-500"
                    onClick={() => setIsCommentsOpen(true)}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center space-x-1 mr-4 text-gray-500 group">
                  0
                  <div className="p-2 rounded-full group-hover:bg-green-900/40 group-hover:text-green-500">
                    <Repeat className="h-5 w-5" />
                  </div>
                </div>
                <div
                  onClick={() => handleLike()}
                  className="flex items-center mr-4 space-x-1 text-gray-500 group cursor-pointer"
                >
                  {likeCount}
                  <div className="p-2 rounded-full group-hover:bg-red-900/40">
                    {isLiked ? (
                      <FaHeart className="h-5 w-5 text-red-500" />
                    ) : (
                      <FaRegHeart className="h-5 w-5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center mr-4 space-x-1 text-gray-500 group">
                  0
                  <div className="p-2 rounded-full group-hover:bg-blue-900/40 group-hover:text-blue-500">
                    <Share className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {post && (
        <div className="mb-64">
          {post.comments[0] === null ? (
            <div className="p-4 text-gray-500 text-xl text-center mb-11">
              No comments{" "}
            </div>
          ) : (
            post.comments.map((comment) => (
              <div
                key={Date.now() + Math.random()}
                className="p-4 mb-4 border-b border-gray-700"
              >
                <div className="flex items-start mb-1">
                  <img
                    src={comment?.owner?.avatar}
                    alt="Profile Picture"
                    className="rounded-full w-12 h-12 mr-2"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-white">
                        {comment?.owner?.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        @{comment?.owner?.username} ·{" "}
                        {new Date(comment?.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-white">{comment?.content}</div>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex justify-between mt-4 w-full max-w-md">
                    <div className="flex items-center space-x-1 mr-4 text-gray-500 group">
                      0
                      <div className="p-2 rounded-full group-hover:bg-blue-900/40 group-hover:text-blue-500">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mr-4 text-gray-500 group">
                      0
                      <div className="p-2 rounded-full group-hover:bg-green-900/40 group-hover:text-green-500">
                        <Repeat className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-center mr-4 space-x-1 text-gray-500 group cursor-pointer">
                      {commentLikeCount}
                      <div
                        onClick={() => handleCommentLike(comment?._id)}
                        className="p-2 rounded-full group-hover:bg-red-900/40"
                      >
                        {isCommentLiked ? (
                          <FaHeart className="h-5 w-5 text-red-500" />
                        ) : (
                          <FaRegHeart className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center mr-4 space-x-1 text-gray-500 group">
                      0
                      <div className="p-2 rounded-full group-hover:bg-blue-900/40 group-hover:text-blue-500">
                        <Share className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TweetById;
