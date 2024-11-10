import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const followUser = asyncHandler(async (req, res) => {});

const unfollowUser = asyncHandler(async (req, res) => {});

export { followUser, unfollowUser };
