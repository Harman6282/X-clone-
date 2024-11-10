import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { generateAndSetToken } from "../utils/generateTokens.js";
import validator from "validator";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

function isValidEmail(email) {
  return validator.isEmail(email);
}
async function isValidPassword(password, passwordDB) {
  return await bcrypt.compare(password, passwordDB);
}

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  // cheking the empty fields
  if (!name) {
    throw new apiError(499, "Please enter the name");
  }
  if (!username || username.trim() === "") {
    throw new apiError(499, "Please enter a valid username");
  }
  if (!email && !isValidEmail(email)) {
    throw new apiError(499, "Please enter valid email");
  }
  if (!password) {
    throw new apiError(499, "Please enter the password");
  }

  const checkEmailExistence = await User.findOne({ email });

  if (checkEmailExistence) {
    // check if the user already exist or not
    throw new apiError(409, "User alredy exits with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: name.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim(),
    password: hashedPassword,
    bio: "",
    coverImage: "",
  });

  if (newUser) {
    generateAndSetToken(newUser, res);
    await newUser.save();
  }

  const response = await User.findById(newUser._id).select(
    "-password -avatar_public_id -coverImage_public_id"
  );

  return res
    .status(200)
    .json(new apiResponse(200, response, "User registered successfully"));
});

const signinUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validating fields
  if (!email || !isValidEmail(email)) {
    throw new apiError(499, "Please enter valid email");
  }
  if (!password) {
    throw new apiError(499, "password is required");
  }
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new apiError(409, "User not found");
  }
  // validating the password
  if (!(await isValidPassword(password, existingUser.password))) {
    throw new apiError(401, "Incorrect password");
  }

  if (existingUser) {
    // generating new  token
    generateAndSetToken(existingUser, res);
    await existingUser.save({ validateBeforeSave: false });
  }

  const response = await User.findById(existingUser._id).select(
    "-password -avatar_public_id -coverImage_public_id"
  );

  return res
    .status(200)
    .json(new apiResponse(200, response, "User Signin successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    // clearing the cookie
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new apiResponse(200, null, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "current user fetched successfully"));
});

const updateAccoutDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  console.log(userId);
  const { name, bio } = req.body;

  // validating the fields
  if (!name) {
    throw new apiError(499, "please enter the name to be updated");
  }

  if (!bio) {
    throw new apiError(499, "please enter the bio to be updated");
  }

  const user = await User.findByIdAndUpdate(
    // updating the details
    userId,
    {
      name: name,
      bio: bio,
    },
    { new: true }
  );

  if (!user) {
    throw new apiError(400, "User not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "Accout details updated successfully"));
});
const updateAvatar = asyncHandler(async (req, res) => {
  const userId = req.user;
  const avatarLocalPath = req.file?.path;

  const currUser = await User.findById(userId);

  if (!avatarLocalPath) {
    throw new apiError(400, "Please upload the avatar");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); // uploading new avatar on the cloudinary
  const user = await User.findByIdAndUpdate(
    userId,
    {
      // updating avatar
      avatar: avatar?.url,
      avatar_public_id: avatar?.public_id,
    },
    { new: true }
  );

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (currUser.avatar_public_id !== "") {
    await deleteFromCloudinary(currUser.avatar_public_id); // deleted previous avatar from cloudinary
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const userId = req.user;
  const coverImgLocalPath = req.file?.path;

  const currUser = await User.findById(userId);

  if (!coverImgLocalPath) {
    throw new apiError(400, "Please upload the cover Image");
  }

  const coverImage = await uploadOnCloudinary(coverImgLocalPath); // uploading new Cover image on the cloudinary
  const user = await User.findByIdAndUpdate(
    userId,
    {
      // updating Cover Image
      coverImage: coverImage?.url,
      coverImage_public_id: coverImage?.public_id,
    },
    { new: true }
  );

  if (!user) {
    throw new apiError(404, "User not found");
  }
  // checking the empty public id
  if (currUser.coverImage_public_id !== "") {
    await deleteFromCloudinary(currUser.coverImage_public_id); // deleted previous cover image from cloudinary
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "Cover image updated successfully"));
});
export {
  registerUser,
  signinUser,
  updateAccoutDetails,
  logoutUser,
  getCurrentUser,
  updateAvatar,
  updateCoverImage,
  followUser,
  unfollowUser,
};
