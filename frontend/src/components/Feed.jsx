import { useState } from "react";
import Post from "./Post";

function Feed() {
  const [posts] = useState([
    {
      id: "1",
      name: "Elon Musk",
      username: "elonmusk",
      avatar:
        "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg",
      content: "X is the future of social media",
      timestamp: "2h",
    },
    {
      id: "2",
      name: "X",
      username: "X",
      avatar:
        "https://pbs.twimg.com/profile_images/1683899100922511362/5lY42eHs_400x400.jpg",
      content: "Everything app",
      timestamp: "4h",
    },
  ]);

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
          <img
            src="https://pbs.twimg.com/profile_images/1683899100922511362/5lY42eHs_400x400.jpg"
            alt="user"
            className="h-12 w-12 rounded-full"
          />
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
        {/* {posts.map((post) => (
          <Post key={Date.now()} />
        ))} */}
      </div>
    </div>
  );
}

export default Feed;
