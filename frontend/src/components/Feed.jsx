import axios from "axios";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setLoading, setTweets } from "../store/tweetSlice";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
function Feed() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  async function getTweets() {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`${backendUrl}/tweet/tweets`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(setTweets(response.data.data));
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    getTweets();
  }, []);

  const tweets = useSelector((store) => store.tweets.tweets);

  return (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl text-white w-2/3">
      <div className=" flex  sticky top-0 bg-black bg-opacity-95 border-b border-gray-700 ">
        <div className="w-1/2 hover:bg-[#181818] ">
          {" "}
          <h2 className="p-4 text-lg font-bold text-center ">For you</h2>
        </div>
        <div className=" p-4 w-1/2 hover:bg-[#181818] text-center">
          {" "}
          <h2 className="text-lg font-bold ">Following</h2>
        </div>
      </div>

      <div className="p-4 border-b border-gray-700 ">
        <div className="flex space-x-4">
          <img src="" alt="user" className="h-12 w-12 rounded-full" />
          <div className="flex-grow">
            <textarea
              className="w-full bg-transparent outline-none text-lg placeholder-gray-600"
              placeholder="What's happening?"
              rows="2"
            />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 text-blue-500">
                {/* Add post action icons here */}
              </div>
              <button className="bg-blue-500 text-white rounded-full px-4 py-2 font-bold hover:bg-blue-600">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {tweets.length > 0 &&
          tweets.map((post) => (
            <Link to={`/tweet/${post._id}`} key={post._id}>
              <Post
                id={post._id}
                content={post.content}
                avatar={post.owner.avatar}
                media={post.media}
                username={post.owner.username}
                name={post.owner.name}
                timestamp={post.createdAt}
                comment={post.comments}
                likes={post.likes}
              />
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Feed;
