import { Heart, MessageCircle, Repeat, Share } from "react-feather";
import PropTypes from "prop-types";

function Post({
  name,
  avatar,
  username,
  timestamp,
  content,
  media,
  comment,
  likes,
}) {
  return (
    <div className="p-4 border-b border-gray-700 hover:bg-gray-900 transition duration-200 cursor-pointer">
      <div className="flex space-x-3">
        <img src={avatar} alt={name} className="h-12 w-12 rounded-full" />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold">{name}</span>
            <span className="text-gray-500">@{username}</span>
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
                  className="w-full max-w-xl rounded-lg"
                />
              ) : (
                <img
                  src={media}
                  alt="Media"
                  className="w-full max-w-xl rounded-lg"
                />
              )}
            </div>
          )}
          <div className="flex justify-between mt-4 w-full max-w-md">
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
            <div className="flex items-center mr-4 space-x-1 text-gray-500 group">
              {likes.length}
              <div className="p-2 rounded-full group-hover:bg-red-900/40 group-hover:text-red-500">
                <Heart className="h-5 w-5" />
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
  name: PropTypes.string.isRequired, // Add prop validation
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  comment: PropTypes.array.isRequired,
  likes: PropTypes.array.isRequired,
  media: PropTypes.string,
};
