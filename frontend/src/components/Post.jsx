import { Heart, MessageCircle, Repeat, Share } from 'react-feather';

function Post({ post }) {
  return (
    <div className="p-4 border-b border-gray-700 hover:bg-gray-900 transition duration-200 cursor-pointer">
      <div className="flex space-x-3">
        <img
          src={post.avatar}
          alt={post.name}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold">{post.name}</span>
            <span className="text-gray-500">@{post.username}</span>
            <span className="text-gray-500">· {post.timestamp}</span>
          </div>
          <p className="mt-2 text-white">{post.content}</p>
          <div className="flex justify-between mt-4 w-full max-w-md">
            <div className="flex items-center space-x-1 text-gray-500 group">
              <div className="p-2 rounded-full group-hover:bg-blue-900/40 group-hover:text-blue-500">
                <MessageCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 group">
              <div className="p-2 rounded-full group-hover:bg-green-900/40 group-hover:text-green-500">
                <Repeat className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 group">
              <div className="p-2 rounded-full group-hover:bg-red-900/40 group-hover:text-red-500">
                <Heart className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 group">
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