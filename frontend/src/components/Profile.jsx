import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Link as LinkIcon } from "react-feather";
import Post from "./Post";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// import { setLoading, setProfile } from "../store/profileSlice";

function ProfileTabs() {
  return (
    <button className="flex w-full justify-around  ">
      <p className="px-10 py-4 hover:bg-[#181818]">Posts</p>
      <p className="px-10 py-4 hover:bg-[#181818]">Replies</p>
      <p className="px-10 py-4 hover:bg-[#181818]">Likes</p>
    </button>
  );
}

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const loadingStatus = useSelector((store) => store.profile.loading);

  const currProfile = useSelector((store) => store.profile.profile);
  useEffect(() => {
    setUserProfile(currProfile);
  }, [currProfile]);

  return loadingStatus ? (
    <div className="text-white text-center text-3xl">Loading...</div>
  ) : (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl w-2/3 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black bg-opacity-95 z-50 h-16">
        <div className="flex items-center p-2 space-x-4">
          <button className="rounded-full p-2 hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">{userProfile?.name}</h2>
            <p className="text-gray-500 text-sm">
              {userProfile?.tweets.length} posts
            </p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative">
        <div className="h-48  bg-gray-800">
          <img
            className="h-48 w-full object-cover"
            src={userProfile?.coverImage  || null}
          
          />
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
          <p className="text-gray-500">@{userProfile?.username}</p>
        </div>

        <p className="mb-4">{userProfile?.bio}</p>

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
            <span className="font-bold">{userProfile?.following.length}</span>{" "}
            <span className="text-gray-500">Following</span>
          </button>
          <button className="hover:underline">
            <span className="font-bold">{userProfile?.followers.length}</span>{" "}
            <span className="text-gray-500">Followers</span>
          </button>
        </div>
      </div>

      {/* Tabs and Posts */}
      <ProfileTabs />
      <div className="divide-y divide-gray-700">
        {userProfile?.tweets.map((post) => (
          <Post
            key={post._id}
            name={userProfile?.name}
            username={userProfile?.username}
            avatar={userProfile?.avatar}
            content={post?.content}
            timestamp={new Date(post?.createdAt).toLocaleDateString()}
            comment={0}
            likes={post.likes}
            media={post.media}
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;
