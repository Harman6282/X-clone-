import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Link as LinkIcon } from "react-feather";
import Post from "./Post";
import axios from "axios";
import { useSelector } from "react-redux";

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
  const [updateDetails, setUpdateDetails] = useState({
    name: "",
    bio: "",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  //  const [avatarFile, setAvatarFile] = useState(null);
  // const [coverImageFile, setCoverImageFile] = useState(null);
  const loadingStatus = useSelector((store) => store.profile.loading);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);

  async function handleImageUpdate() {
    try {
      let updated = false;

      if (selectedAvatar) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", selectedAvatar);

        await axios.patch(`${backendUrl}/users/update-avatar`, avatarFormData, {
          withCredentials: true,
        });

        setSelectedAvatar(null);
        setAvatarPreview(null);
        updated = true;
        console.log("Avatar updated successfully");
      }

      if (selectedCoverImage) {
        const coverImageFormData = new FormData();
        coverImageFormData.append("coverImage", selectedCoverImage);

        await axios.patch(
          `${backendUrl}/users/update-coverImage`,
          coverImageFormData,
          {
            withCredentials: true,
          }
        );

        setSelectedCoverImage(null);
        setCoverImagePreview(null);
        updated = true;
        console.log("Cover image updated successfully");
      }

      if (updated) {
        getCurrProfile(); // Refresh user profile
      }
    } catch (error) {
      console.error("Error updating images:", error);
    }
  }

  function handleImageSelect(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    if (type === "avatar") {
      setAvatarPreview(previewURL);
      setSelectedAvatar(file);
    } else {
      setCoverImagePreview(previewURL);
      setSelectedCoverImage(file);
    }
  }

  async function getCurrProfile() {
    try {
      const response = await axios.get(`${backendUrl}/users/current-user`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setUserProfile(response.data.data);
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    getCurrProfile();
  }, []);

  const currProfile = useSelector((store) => store.profile.profile);
  useEffect(() => {
    setUserProfile(currProfile);
    setUpdateDetails({
      name: currProfile?.name,
      bio: currProfile?.bio,
    });
  }, [currProfile]);

  async function handleDetailsUpdate() {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/update-User`,
        updateDetails,
        { withCredentials: true }
      );
      setUserProfile(response.data.data);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  return loadingStatus ? (
    <div className="text-white text-center text-3xl">Loading...</div>
  ) : (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl w-2/3 text-white">
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black text-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-white hover:bg-gray-700 p-2 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={updateDetails.name}
                  onChange={(e) =>
                    setUpdateDetails({ ...updateDetails, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm mb-1">Bio</label>
                <textarea
                  value={updateDetails.bio}
                  onChange={(e) =>
                    setUpdateDetails({ ...updateDetails, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 text-right">
              <button
                onClick={() => handleDetailsUpdate()}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                update
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}

      <div className="sticky top-0 bg-black bg-opacity-95 z-50 h-16">
        <div className="flex items-center p-2 space-x-4">
          <button
            onClick={() => window.history.back()}
            className="rounded-full p-2 hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">{userProfile?.name}</h2>
            <p className="text-gray-500 text-sm">{0} posts</p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gray-800 relative group">
          <img
            className="h-48 w-full object-cover cursor-pointer "
            src={coverImagePreview || userProfile?.coverImage || null}
            onClick={() => document.getElementById("coverImageInput").click()}
            alt="Cover"
          />
          <input
            type="file"
            id="coverImageInput"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageSelect(e, "coverImage")}
          />
          <div
            className="absolute bottom-2 right-2 bg-blue-900 bg-opacity-100 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={() => document.getElementById("coverImageInput").click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z"
              />
            </svg>
          </div>
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-16 left-4 group">
          <img
            src={avatarPreview || userProfile?.avatar}
            alt="Avatar"
            className="h-32 w-32 rounded-full border-4 border-black cursor-pointer object-cover"
            onClick={() => document.getElementById("avatarInput").click()}
          />
          <input
            type="file"
            id="avatarInput"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageSelect(e, "avatar")}
          />
          <div
            className="absolute bottom-2 right-3 bg-blue-900 bg-opacity-100 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={() => document.getElementById("avatarInput").click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-4">
        <div className="flex items-center justify-between">
          <div className="mb-4 ">
            <h2 className="text-xl font-bold">{userProfile?.name}</h2>
            <p className="text-gray-500">@{userProfile?.username}</p>
          </div>
          <div className="flex justify-end mb-4 space-x-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 border border-gray-700 rounded-full font-bold hover:bg-gray-900"
            >
              Edit profile
            </button>
            {(selectedAvatar || selectedCoverImage) && (
              <button
                onClick={handleImageUpdate}
                className="px-4 py-2 border border-gray-700 rounded-full font-bold hover:bg-gray-900"
              >
                Update Images
              </button>
            )}
          </div>
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
