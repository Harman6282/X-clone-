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
import mongoose from "mongoose";
import { Follow } from "../models/follow.model.js";

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
  const checkUsernameExistence = await User.findOne({ username });

  if (checkEmailExistence) {
    // check if the user already exist or not
    throw new apiError(409, "User alredy exits with this email");
  }
  if (checkUsernameExistence) {
    // check if the user already exist or not
    throw new apiError(409, "Username already taken");
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
  const { username, password } = req.body;

  // validating fields
  if (!username) {
    throw new apiError(499, "Please enter valid username");
  }
  if (!password) {
    throw new apiError(499, "password is required");
  }
  const existingUser = await User.findOne({ username });

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
  if (!req.user) {
    throw new apiError(401, "User not authenticated");
  }
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

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.params.id);

  const user = await User.findById(userId); // check the user existence
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const userProfile = await User.aggregate([
    {
      // here $match is getting the user from the  database collection
      $match: {
        _id: userId,
      },
    },
    {
      //  deselecting the fields which does't have to return
      $project: {
        password: 0,
        avatar_public_id: 0,
        coverImage_public_id: 0,
      },
    },
    {
      // here finding the documents from the follows db collection in which the following field's id is userProfile id and naming it as followers
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },
    {
      // here finding the documents from the follows db collection in which the following field's id is userProfile id and naming it as followers
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },
    {
      // here finding the documents from the follows db collection in which the follower id is userProfile id and naming it as following
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "follower",
        as: "following",
      },
    },
    {
      // here adding and mapping the followers to the user Profile which are going to be return
      $addFields: {
        followers: {
          $map: {
            input: "$followers",
            as: "follower",
            in: "$$follower.follower", // extract only the follower ID
          },
        },
        following: {
          $map: {
            input: "$following",
            as: "follower",
            in: "$$follower.following", // extract only the follwing ID
          },
        },
      },
    },
    {
      // here populating the followers data
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      // here populating the following user data
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "following",
      },
    },
    {
      // selecting the fields which are needed
      $project: {
        "name": 1,
        "bio": 1,
        "username": 1,
        "email": 1,
        "avatar": 1,
        "createdAt": 1,
        "updatedAt": 1,
        "coverImage": 1,
        "followers.name": 1,
        "followers.avatar": 1,
        "followers.username": 1,
        "followers.bio": 1,
        "following.name": 1,
        "following.avatar": 1,
        "following.username": 1,
        "following.bio": 1,
      },
    },
  ]);

  console.log(userProfile);
  return res
    .status(200)
    .json(
      new apiResponse(200, userProfile, "User profile fetched successfully")
    );
});
export {
  registerUser,
  signinUser,
  updateAccoutDetails,
  logoutUser,
  getCurrentUser,
  updateAvatar,
  updateCoverImage,
  getUserProfile,
};
