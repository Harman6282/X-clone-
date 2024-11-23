import PropTypes from "prop-types";
import { MessageCircle, Repeat, Share } from "react-feather";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function Comments({
  avatar,
  name,
  username,
  content,
  timestamp,
  commentlikes,
}) {
  return (
    <div className=" p-4  mb-4 border-b border-gray-700 ">
      <div className="flex items-start mb-1">
        <img
          src={avatar}
          alt="Profile Picture"
          className="rounded-full w-12 h-12 mr-2"
        />
        <div>
          <div className="flex items-center gap-2">
            <div className="font-bold text-white">{name}</div>
            <div className="text-gray-400 text-sm">@{username} · {new Date(timestamp).toLocaleDateString()}</div>
          </div>
          <div className="text-white  ">{content}</div>
        </div>
      </div>
      <div className="flex items-center  mt-2">
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
            <div
              className="flex items-center mr-4 space-x-1 text-gray-500 group cursor-pointer"
            >
            {commentlikes?.length}
              
              <div className="p-2 rounded-full group-hover:bg-red-900/40">
                {/* { ? ( */}
                  <FaHeart className="h-5 w-5 text-red-500" />
                {/* ) : ( */}
                  {/* <FaRegHeart className="h-5 w-5" /> */}
                {/* )} */}
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
  );
}

export default Comments;

Comments.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  commentlikes: PropTypes,
};
