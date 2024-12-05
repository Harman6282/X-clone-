import { MessageCircle, Repeat, Share } from "react-feather";
import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { set } from "mongoose";
import { IoIosMore } from "react-icons/io";

function Post({
  id,
  name,
  avatar,
  username,
  timestamp,
  content,
  media,
  comment,
  likes,
  isLiked,
  // likeCount,
  // handleLike,
}) {
  const [liked, setLiked] = useState(isLiked);

  // setLiked(likes.includes(userId));
  // useEffect(() => {
  //   setLiked(isLiked);
  //   setCount(likeCount);
  // }, [isLiked, likeCount]);

  // async function handleLikeToggle() {
  //   await handleLike(id);
  //   setLiked((prev) => !prev); // Locally toggle like
  //   setCount((prev) => (liked ? prev - 1 : prev + 1)); // Update count locally
  // }


  return (
    <div className="p-4 border-b border-gray-700 transition duration-200 cursor-pointer">
      <div className="flex space-x-3">
        <img src={avatar} alt={name} className="h-12 w-12 rounded-full"/>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold">{name}</span>
            <a className="text-gray-500 ">@{username}</a>
            <span className="text-gray-500">· {timestamp}</span>
          </div>
          <p className="mt-2 text-white">{content}</p>

          {media && (
            <div className="mt-4">
              {media.endsWith(".mp4") || media.endsWith(".webm") ? (
                <video
                  src={media}
                  controls
                  muted
                  className="w-full rounded-lg"
                />
              ) : (
                <img
                  src={media}
                  alt="Media"
                  className="w-full  rounded-lg"
                />
              )}
            </div>
          )}

          <div className="flex justify-between mt-4 w-full max-w-md ">
            <div className="flex items-center space-x-1 mr-4 text-gray-500 group">
              {comment.length}
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
            <div
              // onClick={() => handleLikeToggle()}
              className="flex items-center mr-4 space-x-1 text-gray-500 group cursor-pointer"
            >
              {likes.length }
              <div className="p-2 rounded-full group-hover:bg-red-900/40">
                {liked ? (
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
  );
}

export default Post;

Post.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  comment: PropTypes.array.isRequired,
  likes: PropTypes.array.isRequired,
  media: PropTypes.string,
  comments: PropTypes.array,
  handleLike: PropTypes.func,
  isLiked: PropTypes.bool,
  likeCount: PropTypes.number,
};
