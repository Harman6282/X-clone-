import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Link as LinkIcon } from "react-feather";
import Post from "./Post";
import axios from "axios";

function ProfileTabs() {
  const tabs = ["Posts", "Replies", "Likes"];

  return (
    <div className="flex border-b border-gray-700">
      {tabs.map((tab) => (
        <button key={tab} className="flex-1 py-4 hover:bg-gray-900">
          {tab}
        </button>
      ))}
    </div>
  );
}

function Profile() {
  const  [userProfile, setUserProfile] = useState(null)
  const [userPosts] = useState([
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
      name: "Elon Musk",
      username: "elonmusk",
      avatar:
        "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg",
      content: "Making life multiplanetary 🚀",
      timestamp: "5h",
    },
  ]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  async function getCurrProfile() {

    try {
      const response = await axios.get(`${backendUrl}/users/current-user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie}`
        },
        withCredentials: true,
      });
      console.log(response.data.data);
      setUserProfile(response.data.data)
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    getCurrProfile();
  }, []);


  return (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl w-2/3 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black bg-opacity-95 z-50">
        <div className="flex items-center p-4 space-x-4">
          <button className="rounded-full p-2 hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">{userProfile?.name}</h2>
            <p className="text-gray-500 text-sm">2.8K posts</p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 bg-gray-800">
          <img src={userProfile?.coverImage} alt="" />
        </div>
        <div className="absolute -bottom-16 left-4">
          <img
            src={userProfile?.avatar}
            alt="Elon Musk"
            className="h-32 w-32 rounded-full border-4 border-black"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-4">
        <div className="flex justify-end mb-4">
          <button className="px-4 py-2 border border-gray-700 rounded-full font-bold hover:bg-gray-900">
            Edit profile
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold">{userProfile?.name}</h2>
          <p className="text-gray-500">{userProfile?.username}</p>
        </div>

        <p className="mb-4">
        {userProfile?.bio}
        </p>

        <div className="flex flex-wrap gap-y-2 text-gray-500 mb-4">
          
          <div className="flex items-center mr-4">
            <LinkIcon className="h-5 w-5 mr-2" />
            <a href="https://x.com" className="text-blue-500 hover:underline">
              x.com
            </a>
          </div>
          <div className="flex items-center mr-4">
            <Calendar className="h-5 w-5 mr-2" />
            {new Date(userProfile?.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <button className="hover:underline">
            <span className="font-bold">169</span>{" "}
            <span className="text-gray-500">Following</span>
          </button>
          <button className="hover:underline">
            <span className="font-bold">171.5M</span>{" "}
            <span className="text-gray-500">Followers</span>
          </button>
        </div>
      </div>

      {/* Tabs and Posts */}
      <ProfileTabs />
      <div className="divide-y divide-gray-700">
        {userPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Profile;
